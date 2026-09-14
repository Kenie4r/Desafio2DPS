import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { marcarComoUsada } from '@/redux/slices/comprassSlice';
import type { ticketsBuy } from '@/types/reserva';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<ticketsBuy | null>(null);
  const c = useAppSelector((s) => s.compras);
  const d = useAppDispatch();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const parsed = JSON.parse(data) as ticketsBuy;
      if (!Array.isArray(parsed.seats) || parsed.seats.length === 0) {
        Alert.alert('Error', 'El QR no contiene un asiento válido.');
        return;
      }

      setScannedData(parsed);
    } catch {
      Alert.alert('Error', 'El código QR escaneado no es válido.');
    }
  };

  const handleValidate = () => {
    if (!scannedData) return;

    const seatName = scannedData.seats[0]?.name;
    if (!seatName) {
      Alert.alert('QR inválido', 'Este código QR no tiene asiento asociado.');
      return;
    }

    const compra = c.find(
      (x) =>
        x.movieId === scannedData.movieId &&
        x.theatherId === scannedData.theatherId &&
        x.hour === scannedData.hour &&
        x.seats.some((s) => s.name === seatName),
    );

    if (!compra) {
      Alert.alert('No encontrada', 'Esta compra no existe en el sistema.');
      return;
    }

    if (compra.estado === 'cancelada') {
      Alert.alert(
        'Boleto cancelado',
        'Este boleto fue cancelado y el asiento fue habilitado para otra persona.',
      );
      return;
    }

    const asiento = compra.seats.find((s) => s.name === seatName);
    if (!asiento) {
      Alert.alert('No encontrada', 'Este asiento no existe en la compra.');
      return;
    }

    if (compra.estado === 'usada' || asiento.status === 'usada') {
      Alert.alert(
        'Boleto ya validado',
        'Este boleto o asiento ya fue utilizado. No se permite el ingreso.',
      );
      return;
    }

    const detalle = `Película #${compra.movieId} · Sala ${compra.theatherId} · ${compra.hour}\nAsiento: ${asiento.name}\nPrecio: $${compra.price.toFixed(2)}`;

    Alert.alert('Validar boleto', detalle, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Marcar como usado',
        style: 'default',
        onPress: () => {
          d(
            marcarComoUsada({
              movieId: compra.movieId,
              theatherId: compra.theatherId,
              hour: compra.hour,
              seatName,
            }),
          );
          Alert.alert('Éxito', 'Boleto validado y marcado como utilizado.');
          setScannedData(null);
        },
      },
    ]);
  };

  if (!permission) {
    return <View style={st.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={st.container}>
        <Text style={st.message}>Necesitamos permiso para usar la cámara.</Text>
        <TouchableOpacity style={st.btn} onPress={requestPermission}>
          <Text style={st.btnText}>Solicitar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={st.container}>
      <CameraView
        style={st.camera}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {scannedData && (
        <View style={st.resultPanel}>
          <Text style={st.resultTitle}>Boleto escaneado</Text>
          <Text style={st.resultText}>
            Película #{scannedData.movieId} · Sala {scannedData.theatherId}
          </Text>
          <Text style={st.resultText}>Hora: {scannedData.hour}</Text>
          <Text style={st.resultText}>
            Asientos: {scannedData.seats.map((s) => s.name).join(', ')}
          </Text>
          <Text style={st.resultText}>
            Total: $ {(scannedData.price ?? 0).toFixed(2)}
          </Text>
          <Text style={st.resultText}>Estado: {scannedData.estado}</Text>

          <TouchableOpacity style={st.validateBtn} onPress={handleValidate}>
            <Text style={st.validateBtnText}>Validar Boleto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={st.cancelBtn}
            onPress={() => setScannedData(null)}
          >
            <Text style={st.cancelBtnText}>Escanear otro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  message: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#166534',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },
  resultPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  validateBtn: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  validateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  cancelBtn: {
    backgroundColor: '#64748b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
