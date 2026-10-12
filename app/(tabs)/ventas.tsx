import { useCallback, useRef, useState } from 'react';
import {FlatList,View,Text,StyleSheet,Modal,TouchableOpacity,ScrollView,Alert,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { eliminarCompra } from '@/redux/slices/comprassSlice';
import { liberarAsientoCompra } from '@/redux/slices/salasSlice';
import {cargarReservas,quitarReserva,} from '@/redux/slices/reservasAPISlice';
import {serviceConsume} from '@/services/api';
import type { ReservaAPI } from '@/types/reservaApi';

export default function Ventas() {
  const reservas = useAppSelector((s) => s.reservasApi);
  const comprasLocales = useAppSelector((s) => s.compras);
  const d = useAppDispatch();

  const [cargando, setCargando] = useState(false);
  const [qrItem, setQrItem] = useState<ReservaAPI | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const eliminando = useRef(false);
  const boletoQR = reservas.find((item) => item.id === qrItem?.id) ?? qrItem;

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const data = await serviceConsume.obtenerListadoReservas();
      d(cargarReservas(data));

    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudieron cargar las reservas.',
      );
    } finally {
      setCargando(false);
    }
  }, [d]);

  // Consulta nuevamente al entrar a esta pantalla.
  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const openQr = (item: ReservaAPI) => {
    if (!item.codigo_qr?.trim()) {
      return Alert.alert('QR', 'Esta reserva no tiene código QR.');
    }

    setQrItem(item);
  };

  const deleteTicket = (item: ReservaAPI) => {
    if (eliminando.current) return;

    Alert.alert('Eliminar boleto', '¿Deseas eliminar esta reserva?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          if (eliminando.current) return;

          eliminando.current = true;
          setEliminandoId(item.id);

          try {
            await serviceConsume.eliminarReserva(item.id);
            d(quitarReserva(item.id));

            const compraLocal = comprasLocales.find(
              (compra) => compra.id === item.numero_reserva,
            );

            if (compraLocal) {
              d(liberarAsientoCompra(compraLocal));
              d(eliminarCompra(item.numero_reserva));
            }

            setQrItem((actual) => actual?.id === item.id ? null : actual);
          } catch (error) {
            Alert.alert(
              'Error',
              error instanceof Error
                ? error.message
                : 'No se pudo eliminar la reserva.',
            );
          } finally {
            eliminando.current = false;
            setEliminandoId(null);
          }
        },
      },
    ]);
  };

  return (
    <View style={st.page}>
      <Text style={st.h1}>Boletos vendidos</Text>

      <FlatList
        data={reservas.slice().reverse()}
        keyExtractor={(item) => String(item.id)}
        refreshing={cargando}
        onRefresh={cargar}
        ListEmptyComponent={
          <Text style={st.empty}>
            {cargando ? 'Cargando reservas...' : 'Aún no hay compras.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={st.cardContent}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={st.title}>
                  Reserva #{item.numero_reserva}
                </Text>

                <Text>Película #{item.pelicula_id}</Text>
                <Text>Cliente: {item.nombre_cliente}</Text>
                <Text>Documento: {item.documento}</Text>
                <Text>Función: {item.funcion}</Text>
                <Text>Boletos: {item.cantidad}</Text>

                <Text style={st.price}>
                  $ {item.total.toFixed(2)}
                </Text>

                <Text style={st.status}>
                  Estado: {item.utilizado === 1 ? 'Usada' : 'Sin utilizar'}
                </Text>
              </View>

              <View style={st.actions}>
                <TouchableOpacity
                  style={st.qrButton}
                  onPress={() => openQr(item)}
                >
                  <Text style={st.qrButtonText}>Ver QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={st.deleteButton}
                  disabled={eliminandoId !== null}
                  onPress={() => deleteTicket(item)}
                >
                  <Text style={st.deleteButtonText}>
                    {eliminandoId === item.id ? 'Eliminando...' : 'Eliminar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Modal
        visible={qrItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setQrItem(null)}
      >
        <View style={st.modalOverlay}>
          <ScrollView contentContainerStyle={st.modalContent}>
            <Text style={st.modalTitle}>Código QR de la compra</Text>

            {boletoQR && (
              <View style={st.qrRow}>
                <QRCode
                  value={boletoQR.codigo_qr}
                  size={220}
                  backgroundColor="#fff"
                  color="#000"
                />

                <Text style={st.qrSeatText}>
                  Reserva #{boletoQR.numero_reserva}
                  {'\n'}
                  {boletoQR.nombre_cliente}
                  {'\n'}
                  {boletoQR.cantidad} boleto(s)
                  {'\n'}
                  Estado: {boletoQR.utilizado === 1 ? 'Utilizado' : 'Pendiente'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={st.modalCloseBtn}
              onPress={() => setQrItem(null)}
            >
              <Text style={st.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
const st = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    paddingTop: 50,
  },
  h1: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: '800', fontSize: 17 },
  price: { fontWeight: '900', color: '#047857', fontSize: 18, marginTop: 5 },
  status: { fontSize: 13, color: '#64748b', marginTop: 4 },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  qrButton: {
    backgroundColor: '#166534',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    width: 110,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    width: 110,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 30 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    margin: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  modalBody: { fontSize: 13, color: '#64748b', marginTop: 12, marginBottom: 4 },
  qrRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrSeatText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  modalCloseBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  modalCloseText: { color: '#fff', fontWeight: '800' },
});
