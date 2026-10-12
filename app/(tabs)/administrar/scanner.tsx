import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { marcarReservaComoUsada } from '@/redux/slices/comprassSlice';
import { guardarReserva } from '@/redux/slices/reservasAPISlice';
import type { ReservaAPI, DatosQR } from '@/types/reservaApi';
import { serviceConsume } from '@/services/api';

function leerQR(codigo: string): DatosQR | null {
  try {
    let datos = JSON.parse(codigo);
    if (typeof datos === 'string') datos = JSON.parse(datos);
    return datos && Array.isArray(datos.asientos) ? datos : null;
  } catch { return null; }
}

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [reserva, setReserva] = useState<ReservaAPI | null>(null);
  const [escaneado, setEscaneado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const bloqueo = useRef(false);
  const movies = useAppSelector((s) => s.movie);
  const d = useAppDispatch();
  const movie = movies.find((m) => m.id === reserva?.pelicula_id);
  const datosQR = reserva ? leerQR(reserva.codigo_qr) : null;

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (bloqueo.current) return;
    bloqueo.current = true;
    setEscaneado(true);
    setProcesando(true);
    try {
      const datos = leerQR(data);
      const reservas = await serviceConsume.obtenerListadoReservas();
      const coincidencias = reservas.filter((item) => {
        if (item.codigo_qr === data) return true;
        const almacenado = leerQR(item.codigo_qr);
        if (!datos || !almacenado) return false;
        if (datos.numero_reserva) return item.numero_reserva === datos.numero_reserva;
        // JSON puede venir con otro orden de propiedades desde MySQL.
        return !almacenado.numero_reserva &&
          Number(almacenado.cod_pelicula) === Number(datos.cod_pelicula) &&
          JSON.stringify(almacenado.asientos.map((s) => s.name).sort()) ===
          JSON.stringify(datos.asientos.map((s) => s.name).sort());
      });
      if (coincidencias.length === 0) throw new Error('Este boleto no existe en la API.');
      if (coincidencias.length > 1) {
        throw new Error('Este QR antiguo corresponde a varias reservas. No se puede identificar un boleto único.');
      }
      setReserva(coincidencias[0]);
      d(guardarReserva(coincidencias[0]));
    } catch (error) {
      Alert.alert('No se pudo consultar el boleto', error instanceof Error ? error.message : 'Intenta de nuevo.');
    } finally { setProcesando(false); }
  };

  const handleValidate = async () => {
    if (!reserva || procesando) return;
    setProcesando(true);
    try {
      // El servidor decide si es válido y cambia el estado de forma atómica.
      const actualizada = await serviceConsume.validarBoleto(reserva.numero_reserva);
      setReserva(actualizada);
      d(guardarReserva(actualizada));
      d(marcarReservaComoUsada(actualizada.numero_reserva));
      Alert.alert('Boleto válido', 'Entrada registrada. El boleto quedó utilizado.');
    } catch (error) {
      Alert.alert('Validación del boleto', error instanceof Error ? error.message : 'No se pudo validar el boleto.');
      try {
        const actualizada = await serviceConsume.obtenerReserva(reserva.id);
        setReserva(actualizada);
        d(guardarReserva(actualizada));
        if (actualizada.utilizado === 1) d(marcarReservaComoUsada(actualizada.numero_reserva));
      } catch {  }
    } finally { setProcesando(false); }
  };

  if (!permission) return <View style={st.container} />;
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
        onBarcodeScanned={escaneado ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      {escaneado && (
        <View style={st.resultPanel}>
          <Text style={st.resultTitle}>{procesando ? 'Consultando API...' : 'Boleto escaneado'}</Text>
          {reserva && (
            <>
              <Text style={st.resultText}>Reserva #{reserva.numero_reserva}</Text>
              <Text style={st.resultText}>{movie?.nombre ?? `Película #${reserva.pelicula_id}`} · Sala {movie?.sala ?? '—'}</Text>
              <Text style={st.resultText}>Cliente: {reserva.nombre_cliente}</Text>
              <Text style={st.resultText}>Función: {reserva.funcion}</Text>
              <Text style={st.resultText}>Asientos: {datosQR?.asientos.map((s) => s.name).join(', ') ?? '—'}</Text>
              <Text style={st.resultText}>Total: $ {reserva.total.toFixed(2)}</Text>
              <Text style={st.resultText}>Estado: {reserva.utilizado === 1 ? 'Utilizado' : 'Pendiente'}</Text>
              <TouchableOpacity
                style={[st.validateBtn, (procesando || reserva.utilizado === 1) && { opacity: 0.5 }]}
                onPress={handleValidate}
                disabled={procesando || reserva.utilizado === 1}
              >
                <Text style={st.validateBtnText}>{reserva.utilizado === 1 ? 'Boleto ya utilizado' : 'Validar boleto'}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={[st.cancelBtn, procesando && { opacity: 0.5 }]}
            disabled={procesando}
            onPress={() => { setReserva(null); setEscaneado(false); bloqueo.current = false; }}
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
