import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { eliminarCompra } from '@/redux/slices/comprassSlice';
import { liberarAsiento as liberarAsientoSeleccion } from '@/redux/slices/selectSalaSlice';
import { liberarAsientoCompra } from '@/redux/slices/salasSlice';
import type { ticketsBuy } from '@/types/reserva';
import { useState } from 'react';

export default function Ventas() {
  const c = useAppSelector((s) => s.compras);
  const d = useAppDispatch();
  const [qrVisible, setQrVisible] = useState(false);
  const [qrItem, setQrItem] = useState<ticketsBuy | null>(null);

  const openQr = (item: ticketsBuy) => {
    setQrItem(item);
    setQrVisible(true);
  };

  const deleteTicket = (item: ticketsBuy) => {
    Alert.alert('Eliminar boleto', '¿Deseas eliminar esta compra?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          item.seats.forEach((seat) => d(liberarAsientoSeleccion(seat)));
          d(liberarAsientoCompra(item));
          d(eliminarCompra(item.id ?? `${item.movieId}-${item.theatherId}-${item.hour ?? 'sin-hora'}-${item.seats.map((x) => x.name).join('|')}`));
        },
      },
    ]);
  };

  return (
    <View style={st.page}>
      <Text style={st.h1}>Boletos vendidos</Text>
      <FlatList
        data={c.slice().reverse()}
        keyExtractor={(_, i) => String(i)}
        ListEmptyComponent={<Text style={st.empty}>Aún no hay compras.</Text>}
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={st.cardContent}>
              <View>
                <Text style={st.title}>Película #{item.movieId}</Text>
                <Text>
                  Sala: {item.theatherId} · Hora: {item.hour}
                </Text>
                <Text>
                  Asientos: {item.seats.map((x) => x.name).join(', ')}
                </Text>
                <Text style={st.price}>$ {(item.price ?? 0).toFixed(2)}</Text>
                <Text style={st.status}>Estado: {item.estado}</Text>
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
                  onPress={() => deleteTicket(item)}
                >
                  <Text style={st.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Modal
        visible={qrVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrVisible(false)}
      >
        <View style={st.modalOverlay}>
          <ScrollView contentContainerStyle={st.modalContent}>
            <Text style={st.modalTitle}>Código QR por asiento</Text>
            {qrItem &&
              qrItem.seats.map((seat) => {
                const seatOnlyQr = {
                  ...qrItem,
                  seats: [seat],
                };

                return (
                  <View key={seat.name} style={st.qrRow}>
                    <QRCode
                      value={JSON.stringify(seatOnlyQr)}
                      size={150}
                      backgroundColor="transparent"
                      color="#000"
                    />
                    <Text style={st.qrSeatText}>
                      Película #{qrItem.movieId} · Sala {qrItem.theatherId} ·{' '}
                      {qrItem.hour} · Asiento {seat.name}
                    </Text>
                  </View>
                );
              })}

            <TouchableOpacity
              style={st.modalCloseBtn}
              onPress={() => setQrVisible(false)}
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
