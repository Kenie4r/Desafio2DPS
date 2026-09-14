import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';

export default function AdminIndex() {
  const router = useRouter();
  const movies = useAppSelector((s) => s.movie);
  const functions = useAppSelector((s) => s.movieTheater);
  const compras = useAppSelector((s) => s.compras);

  const tickets = compras.reduce((a, x) => a + x.seats.length, 0);
  const sales = compras.reduce((a, x) => a + (x.price ?? 0), 0);
  const availableSeats = functions.reduce(
    (a, x) =>
      a +
      x.lines.reduce(
        (b, l) => b + l.seats.filter((s) => s.status === 'activo').length,
        0,
      ),
    0,
  );
  const occupiedSeats = functions.reduce(
    (a, x) =>
      a +
      x.lines.reduce(
        (b, l) =>
          b +
          l.seats.filter(
            (s) =>
              s.status === 'seleccionado' ||
              s.status === 'inactivo' ||
              s.status === 'preseleccionado',
          ).length,
        0,
      ),
    0,
  );

  const movieCount = new Map<number, number>();
  compras.forEach((c) => {
    movieCount.set(
      c.movieId,
      (movieCount.get(c.movieId) ?? 0) + c.seats.length,
    );
  });
  const topMovieId = [...movieCount.entries()].reduce(
    (max, [id, count]) => (count > (max[1] ?? 0) ? [id, count] : max),
    [0, 0] as [number, number],
  )[0];
  const topMovie = movies.find((m) => m.id === topMovieId);

  return (
    <ScrollView style={st.page} contentContainerStyle={st.content}>
      <Text style={st.h1}>Zona de Personal</Text>
      <Text style={st.sub}>Dashboard y herramientas de administración</Text>

      <View style={st.grid}>
        {[
          ['Películas', movies.length],
          ['Funciones', functions.length],
          ['Boletos vendidos', tickets],
          ['Asientos disponibles', availableSeats],
          ['Asientos ocupados', occupiedSeats],
          ['Ingresos', `$ ${sales.toFixed(2)}`],
        ].map(([label, value]) => (
          <View style={st.statCard} key={String(label)}>
            <Text style={st.statLabel}>{label}</Text>
            <Text style={st.statValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={st.section}>
        <Text style={st.h2}>Película más reservada</Text>
        <Text style={st.movieTitle}>
          {topMovie ? topMovie.title : 'Sin reservas'}
        </Text>
      </View>

      <View style={st.section}>
        <Text style={st.h2}>Herramientas</Text>
        <TouchableOpacity
          style={st.toolBtn}
          onPress={() => router.push('/(tabs)/administrar/peliculas')}
        >
          <Text style={st.toolBtnText}>Gestión de Películas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={st.toolBtn}
          onPress={() => router.push('/(tabs)/administrar/scanner')}
        >
          <Text style={st.toolBtnText}>Validar Boleto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingTop: 50,
  },
  h1: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  sub: {
    color: '#64748b',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    width: '48%',
    elevation: 1,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  h2: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
  },
  toolBtn: {
    backgroundColor: '#166534',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  toolBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
