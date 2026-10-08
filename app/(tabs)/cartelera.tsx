import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState , useEffect} from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MovieCard from '@/components/MovieCard';
import SeatMap from '@/components/SeatMap';
import BuyPanel from '@/components/BuyPanel';
import { seleccionar } from '@/redux/slices/selectSalaSlice';
import { iniciarReserva } from '@/redux/slices/reservaSlice';
import type { Movie } from '@/types/pelicula';
import { Ionicons } from '@expo/vector-icons';
import { obtenerPeliculas } from '@/redux/slices/peliculasSlices';
import { obtenerCategorias } from '@/redux/slices/categoriaSlice';


export default function Cartelera() {
  const capitalize = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  const movies =  useAppSelector((s) => s.movie);
  const salas = useAppSelector((s) => s.movieTheater);
  const selected = useAppSelector((s) => s.selectmovieTheather);
  const moviesDisponibles = movies.filter((m) => m.estado === 'ACTIVO');
  const d = useAppDispatch();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    0,
  );
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const open = (m: Movie) => {
    setMovie(m);
    const sala = salas.find((x) => x.movieId === m.id);
    if (sala) {
      d(seleccionar(sala));
      d(
        iniciarReserva({
          movieId: m.id,
          price: 0,
          seats: [],
          theatherId: sala.MovieTheaterNumber,
          hour: sala.hour,
          total: 0,
          estado: 'completada',
        }),
      );
    }
  };

  const categorias = useAppSelector((s) => s.categoria);

  const tiposPeliculas = [{ id: 0, descripcion: 'Todos' },...categorias,];
  useEffect(() => {
    void d(obtenerPeliculas()).unwrap().catch((error) => console.error(error));
    void d(obtenerCategorias()).unwrap().catch((error) => console.error(error))
  }, [d]);


  const filteredMovies = moviesDisponibles.filter(
    (m) =>
      (selectedCategory === 0 || selectedCategory === m.genero_id) &&
      m.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={st.page}>
      <ScrollView contentContainerStyle={st.content}>
        <Text style={st.h1}>Cartelera</Text>

        {showSearch && (
          <View style={st.searchWrapper}>
            <TextInput
              style={st.input}
              placeholder="Buscar película..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={st.searchResultsContainer}
              >
                {filteredMovies
                  .filter((m) =>
                    m.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={item}
                      onPress={() => {
                        setMovie(item);
                        setShowSearch(false);
                      }}
                    />
                  ))}
              </ScrollView>
            )}
          </View>
        )}

        <Text style={st.h2}>En cartelera</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.scrollContainer}
        >
          {tiposPeliculas.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[st.button, selectedCategory === cat.id && st.activeButton]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  st.buttonText,
                  selectedCategory === cat.id && st.activeButtonText,
                ]}
              >
                {capitalize(cat.descripcion)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={st.movieGrid}>
          
              {filteredMovies.map((m) => (
               <View style={st.movieItem}>
               <MovieCard key={m.id} movie={m} categoria={tiposPeliculas.filter( c => c.id == m.genero_id)[0]}
                onPress={() => open(m)} />
                </View>
              ))}
          
          
        </View>

      </ScrollView>

      <Modal visible={!!selected.movieId} animationType="slide">
        <View style={st.modal}>
          <View style={st.modalHead}>
            <Text style={st.modalTitle}>
              {movie?.nombre} · Sala {selected.MovieTheaterNumber} ·{' '}
              {selected.hour}
            </Text>
            <Pressable
              onPress={() =>
                d(
                  seleccionar({
                    lines: [],
                    movieId: 0,
                    MovieTheaterNumber: 0,
                    hour: '',
                  }),
                )
              }
            >
              <Text style={st.close}>Cerrar</Text>
            </Pressable>
          </View>
          <SeatMap sala={selected} />
          <BuyPanel />
        </View>
      </Modal>

      <TouchableOpacity
        style={st.floatingButton}
        onPress={() => setShowSearch((prev) => !prev)}
        activeOpacity={0.8}
      >
       <Ionicons name="search-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const st = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  h1: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 20,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  searchResultsContainer: {
    paddingHorizontal: 8,
    gap: 10,
    alignItems: 'center',
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 12,
    color: '#1e293b',
  },
  modal: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 80,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  close: {
    color: '#dc2626',
    fontWeight: '800',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#166534',
    color: '#ffffff',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#166534',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  movieGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: 16,
},
movieItem: {
  width: '48%',
},
});
