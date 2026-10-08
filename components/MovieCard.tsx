import { Pressable, Image, Text, StyleSheet, View } from 'react-native';
import type { Movie } from '@/types/pelicula';
import { Categoria } from '@/types/categoria';
export default function MovieCard({movie,categoria,onPress,}: {movie: Movie; categoria : Categoria;onPress: () => void;}) {
  const capitalize = (texto) =>texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  return (
    <Pressable onPress={onPress} style={s.card}>
      <Image source={{ uri: movie.url_image }} style={s.image} />
      <View style={s.overlay}>
        <Text style={s.title}>{movie.nombre}</Text>
        <Text style={s.genre}>{capitalize(categoria?.descripcion ?? "")}</Text>
      </View>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: {
    //width: 180,
    height: 260,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginRight: 14,
    width: '100%',
    marginHorizontal: 0,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,.55)',
  },
  title: { color: '#fff', fontSize: 17, fontWeight: '700' },
  genre: { color: '#ddd', marginTop: 3 },
});
