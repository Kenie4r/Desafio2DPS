import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet,Image,} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteMovie, toggleStatus } from '@/redux/slices/peliculasSlices';
import { removeTheatersForMovie } from '@/redux/slices/salasSlice';
import { guardarPelicula } from '@/redux/slices/peliculasSlices';

export default function AdminPeliculas() {
  const router = useRouter();
  const movies = useAppSelector((s) => s.movie);
  const d = useAppDispatch();

  const handleDelete = (id: number, title: string) => {
    Alert.alert('Eliminar película', `¿Eliminar "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          d(deleteMovie(id));
          d(removeTheatersForMovie(id));
        },
      },
    ]);
  };

  const handleToggleStatus = (id: number, status: string) => {
    d(toggleStatus(id));
  };

  return (
    <View style={st.page}>
      <View style={st.header}>
        <Text style={st.h1}>Películas</Text>
        <TouchableOpacity
          style={st.addBtn}
          onPress={() => router.push('/(tabs)/administrar/pelicula-add')}
        >
          <Text style={st.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(x) => String(x.id)}
        ListEmptyComponent={
          <Text style={st.empty}>No hay películas registradas.</Text>
        }
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={st.cardRow}>
              <Image
                source={{ uri: item.url_image || 'https://placehold.co/120x160/png' }}
                style={st.cardImage}
              />
              <View style={st.cardInfo}>
                <Text style={st.cardTitle}>{item.nombre}</Text>
                <Text style={st.cardSub}>
                  {item.genero_id} · {item.duracion} min · {item.clasificacion}
                </Text>
                <Text style={st.cardSub}>Sala: {item.sala}</Text>
                <Text style={st.cardSub}>
                  Precio: ${(item.precio ?? 0).toFixed(2)}
                </Text>
                <Text
                  style={[
                    st.statusBadge,
                    {
                      backgroundColor:
                        item.estado === 'Disponible' ? '#dcfce7' : '#fee2e2',
                      color: item.estado === 'Disponible' ? '#166534' : '#991b1b',
                    },
                  ]}
                >
                  {item.estado}
                </Text>
              </View>
            </View>

            <View style={st.cardActions}>
              <TouchableOpacity
                style={[st.actionBtn, st.editBtn]}
                onPress={() => router.push(`/(tabs)/administrar/${item.id}`)}
              >
                <Text style={st.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.actionBtn, st.toggleBtn]}
                onPress={() => handleToggleStatus(item.id, item.estado)}
              >
                <Text style={st.actionText}>
                  {item.estado === 'Disponible' ? 'Ocultar' : 'Activar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.actionBtn, st.deleteBtn]}
                onPress={() => handleDelete(item.id, item.nombre)}
              >
                <Text style={st.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  h1: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  addBtn: {
    backgroundColor: '#166534',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cardImage: {
    width: 70,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
  },
  cardInfo: {
    flex: 1,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#475569',
  },
  toggleBtn: {
    backgroundColor: '#2563eb',
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 30,
  },
});
