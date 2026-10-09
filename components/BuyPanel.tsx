import { useRef, useState } from 'react';
import {View,Text,TextInput,Pressable,StyleSheet,Alert,} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { agregarCompra } from '@/redux/slices/comprassSlice';
import { limpiarSeleccion } from '@/redux/slices/reservaSlice';
import { cerrarAsiento, seleccionar } from '@/redux/slices/selectSalaSlice';
import { syncSelectedTheater } from '@/redux/slices/salasSlice';
import { guardarReserva } from '@/redux/slices/reservasAPISlice';
import { serviceConsume } from '@/services/api';
import type { DatosQR } from '@/types/reservaApi';

export default function BuyPanel() {
  const d = useAppDispatch();
  const r = useAppSelector((s) => s.reservation);
  const selectedTheater = useAppSelector((s) => s.selectmovieTheather);
  const compras = useAppSelector((s) => s.compras);
  const movie = useAppSelector((s) => s.movie.find((m) => m.id === r.movieId));

  const precioUnitario = Number(movie?.precio ?? 3.5);

  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');

  const [guardando, setGuardando] = useState(false);
  const enviando = useRef(false);

  const buy = async () => {
    if (enviando.current) return;

    if (!r.seats.length) {
      return Alert.alert('Compra', 'Selecciona al menos un asiento.');
    }

    if (!nombre.trim() || !documento.trim()) {
      return Alert.alert('Compra', 'Ingresa el nombre y documento del cliente.');
    }

    const hoy = new Date();
    const dosDigitos = (n: number) => String(n).padStart(2, '0');

    const fechaFuncion =
    `${hoy.getFullYear()}-${dosDigitos(hoy.getMonth() + 1)}-${dosDigitos(hoy.getDate())}` +
    ` ${dosDigitos(hoy.getHours())}:${dosDigitos(hoy.getMinutes())}:${dosDigitos(hoy.getSeconds())}`;

    if (!Number.isFinite(precioUnitario) || precioUnitario <= 0) {
      return Alert.alert('Compra', 'El precio de la película no es válido.');
    }

    const occupiedInMap = r.seats.some((seat) => {
      const line = selectedTheater.lines.find(
        (l) => l.lineNumber === seat.name[0],
      );

      const mapSeat = line?.seats.find((x) => x.name === seat.name);

      return mapSeat?.status === 'inactivo' || mapSeat?.status === 'usada';
    });

    const occupiedInCompras = r.seats.some((selectedSeat) =>
      compras.some(
        (compra) =>
          compra.movieId === r.movieId &&
          compra.theatherId === r.theatherId &&
          compra.hour === r.hour &&
          compra.seats.some((seat) => seat.name === selectedSeat.name),
      ),
    );

    if (occupiedInMap || occupiedInCompras) {
      return Alert.alert(
        'Asiento ocupado',
        'Ese asiento ya está ocupado. Selecciona otro asiento.',
      );
    }

    enviando.current = true;
    setGuardando(true);

    try {
      const numeroReserva = String(Math.floor(100000000 + Math.random() * 900000000),);

      const total = Number((r.seats.length * precioUnitario).toFixed(2));

      const datosQR: DatosQR = {
        asientos: r.seats.map((seat) => ({ ...seat })),
        cod_pelicula: r.movieId,
      };
        const reserva = await serviceConsume.guardarReserva({
        numero_reserva: numeroReserva,
        codigo_qr: JSON.stringify(datosQR),
        usuario_id: 1,
        pelicula_id: r.movieId,
        nombre_cliente: nombre.trim(),
        documento: documento.trim(),
        funcion: fechaFuncion,
        cantidad: r.seats.length,
        total,
        utilizado: 0,
      });

      // La reserva del servidor queda disponible inmediatamente en el listado.
      d(guardarReserva(reserva));

      // Conserva tu manejo local de compras y asientos.
      d(
        agregarCompra({
          ...r,
          id: reserva.numero_reserva,
          price: total,
          total,
          estado: 'completada',
        }),
      );

      r.seats.forEach((seat) => d(cerrarAsiento(seat)));

      // Sincroniza un mapa que ya contiene los asientos cerrados.
      const nombresComprados = new Set(r.seats.map((seat) => seat.name));

      const salaActualizada = {
        ...selectedTheater,
        lines: selectedTheater.lines.map((line) => ({
          ...line,
          seats: line.seats.map((seat) =>
            nombresComprados.has(seat.name)
              ? { ...seat, status: 'inactivo' as const }
              : seat,
          ),
        })),
      };

      d(syncSelectedTheater(salaActualizada));
      d(limpiarSeleccion());
      d(
        seleccionar({
          lines: [],
          movieId: 0,
          MovieTheaterNumber: 0,
          hour: '',
        }),
      );

      setNombre('');
      setDocumento('');
      

      Alert.alert('Compra realizada', 'Tu reserva fue guardada correctamente.');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo guardar la compra.',
      );
    } finally {
      enviando.current = false;
      setGuardando(false);
    }
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

      <TextInput
        style={st.input}
        placeholder="Nombre del cliente"
        value={nombre}
        onChangeText={setNombre}
        editable={!guardando}
      />

      <TextInput
        style={st.input}
        placeholder="Documento"
        value={documento}
        onChangeText={setDocumento}
        editable={!guardando}
      />

      {r.seats.map((seat) => (
        <View style={st.item} key={seat.name}>
          <Text style={st.badge}>{seat.name}</Text>
          <View>
            <Text style={st.itemTitle}>Asiento</Text>
            <Text>{movie?.nombre ?? 'Película'}</Text>
          </View>
        </View>
      ))}

      <Pressable
        onPress={buy}
        disabled={guardando}
        style={[st.buy, guardando && { opacity: 0.6 }]}
      >
        <Text style={st.buyText}>
          {guardando ? 'Guardando...' : 'Confirmar compra'}
        </Text>
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
  input: {
  borderWidth: 1,
  borderColor: '#cbd5e1',
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
  color: '#0f172a',
},
});
