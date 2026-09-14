import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/redux/hooks';
import { addMovie } from '@/redux/slices/peliculasSlices';
import { addTheatersForMovie } from '@/redux/slices/salasSlice';
import MovieForm from '@/components/MovieForm';
import type { Movie } from '@/types/pelicula';

export default function PeliculaAdd() {
  const router = useRouter();
  const d = useAppDispatch();

  const handleSubmit = (data: Omit<Movie, 'id'> & { id?: number }) => {
    d(addMovie({ ...data, id: undefined }));
    d(addTheatersForMovie(Date.now()));
    router.back();
  };

  return (
    <ScrollView style={st.page} contentContainerStyle={st.content}>
      <Text style={st.h1}>Agregar Película</Text>
      <MovieForm isEditing={false} onSubmit={handleSubmit} />
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
});
