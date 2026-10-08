import { View, Text, ScrollView, StyleSheet, Alert  } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/redux/hooks';
import { addMovie } from '@/redux/slices/peliculasSlices';
import { addTheatersForMovie } from '@/redux/slices/salasSlice';
import MovieForm from '@/components/MovieForm';
import type { Movie } from '@/types/pelicula';
import { guardarPelicula } from '@/redux/slices/peliculasSlices';

export default function PeliculaAdd() {
  const router = useRouter();
  const d = useAppDispatch();


  const handleSubmit = async (data: Omit<Movie, 'id'> & { id?: number },) => {
    const { id, ...pelicula } = data;
    try {
      await d(guardarPelicula(pelicula)).unwrap();
      router.back();
    } catch (error) {
      Alert.alert('Error al guardar',typeof error === 'string'? error: 'No se pudo guardar la película',);
    }
  };
  /*const handleSubmit = (data: Omit<Movie, 'id'> & { id?: number }) => {
    d(addMovie({ ...data, id: undefined }));
   // d(addTheatersForMovie(Date.now()));
    router.back();
  };*/

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
