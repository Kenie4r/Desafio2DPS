import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { agregarCompra } from '@/redux/slices/comprassSlice';
import { limpiarSeleccion } from '@/redux/slices/reservaSlice';
import { cerrarAsiento, seleccionar } from '@/redux/slices/selectSalaSlice';
import { syncSelectedTheater } from '@/redux/slices/salasSlice';

export default function BuyPanel() {
  const d = useAppDispatch();
  const r = useAppSelector((s) => s.reservation);
  const selectedTheater = useAppSelector((s) => s.selectmovieTheather);
  const compras = useAppSelector((s) => s.compras);
  const movie = useAppSelector((s) => s.movie.find((m) => m.id === r.movieId));
  const precioUnitario = movie?.precio ?? 3.5;

  const buy = () => {
    if (!r.seats.length)
      return Alert.alert('Compra', 'Selecciona al menos un asiento.');

    const occupiedInMap = r.seats.some((seat) => {
      const line = selectedTheater.lines.find((l) => l.lineNumber === seat.name[0]);
      const mapSeat = line?.seats.find((x) => x.name === seat.name);
      return mapSeat?.status === 'inactivo' || mapSeat?.status === 'usada';
    });

    const occupiedInCompras = r.seats.some((selectedSeat) => {
      return compras.some((compra) => {
        if (
          compra.movieId !== r.movieId ||
          compra.theatherId !== r.theatherId ||
          compra.hour !== r.hour
        )
          return false;

        return compra.seats.some((seat) => seat.name === selectedSeat.name);
      });
    });

    if (occupiedInMap || occupiedInCompras) {
      Alert.alert(
        'Asiento ocupado',
        'Ese asiento ya está ocupado. Selecciona otro asiento.',
      );
      return;
    }

    const compraId = `${r.movieId}-${r.theatherId}-${r.hour}-${r.seats.map((x) => x.name).join('|')}-${Date.now()}`;

    d(
      agregarCompra({
        ...r,
        id: compraId,
        price: r.seats.length * precioUnitario,
        total: r.seats.length * precioUnitario,
      }),
    );

    r.seats.forEach((x) => d(cerrarAsiento(x)));
    d(syncSelectedTheater(selectedTheater));
    d(limpiarSeleccion());
    d(seleccionar({ lines: [], movieId: 0, MovieTheaterNumber: 0, hour: '' }));
    Alert.alert('Compra realizada', 'Tus boletos fueron registrados.');
  };

  return (
    <View style={st.box}>
      <Text style={st.label}>COMPRA DE BOLETOS</Text>
      <Text style={st.total}>
        $ {(r.seats.length * precioUnitario).toFixed(2)}
      </Text>
      <Text style={st.muted}>
        {r.seats.length} asiento(s) × ${precioUnitario.toFixed(2)}
      </Text>
      {r.seats.map((x) => (
        <View style={st.item} key={x.name}>
          <Text style={st.badge}>{x.name}</Text>
          <View>
            <Text style={st.itemTitle}>Asiento</Text>
            <Text>{movie?.title ?? 'Película'}</Text>
          </View>
        </View>
      ))}
      <Pressable onPress={buy} style={st.buy}>
        <Text style={st.buyText}>Confirmar compra</Text>
      </Pressable>
    </View>
  );
}
const st = StyleSheet.create({
  box: { backgroundColor: '#fff', padding: 16, borderRadius: 16, margin: 12 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#64748b',
  },
  total: { fontSize: 32, fontWeight: '900', color: '#047857', marginTop: 4 },
  muted: { color: '#64748b', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    fontWeight: '700',
  },
  itemTitle: { fontWeight: '700' },
  buy: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buyText: { color: '#fff', fontWeight: '800' },
});
