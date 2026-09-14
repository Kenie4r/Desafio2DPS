import { Pressable, Image, Text, StyleSheet, View } from 'react-native';
import type { Movie } from '@/types/pelicula';
export default function MovieCard({
  movie,
  onPress,
}: {
  movie: Movie;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.card}>
      <Image source={{ uri: movie.image }} style={s.image} />
      <View style={s.overlay}>
        <Text style={s.title}>{movie.title}</Text>
        <Text style={s.genre}>{movie.genre}</Text>
      </View>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: {
    width: 180,
    height: 260,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginRight: 14,
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
