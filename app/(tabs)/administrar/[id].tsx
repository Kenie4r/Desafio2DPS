import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMovie } from '@/redux/slices/peliculasSlices';
import MovieForm from '@/components/MovieForm';
import type { Movie } from '@/types/pelicula';

export default function PeliculaEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = useAppDispatch();
  const movie = useAppSelector((s) => s.movie.find((m) => m.id === Number(id)));

  if (!movie) {
    return (
      <View style={st.page}>
        <Text style={st.error}>Película no encontrada</Text>
      </View>
    );
  }

  const handleSubmit = (data: Omit<Movie, 'id'> & { id?: number }) => {
    d(updateMovie({ ...data, id: movie.id }));
    router.back();
  };

  return (
    <ScrollView style={st.page} contentContainerStyle={st.content}>
      <Text style={st.h1}>Editar Película</Text>
      <MovieForm initial={movie} isEditing={true} onSubmit={handleSubmit} />
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
    paddingBottom: 30,
  },
  h1: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: '#dc2626',
    textAlign: 'center',
    paddingTop: 80,
  },
});
