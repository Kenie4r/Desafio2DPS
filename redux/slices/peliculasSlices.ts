import { createSlice, PayloadAction , createAsyncThunk,} from '@reduxjs/toolkit';
import type { Movie } from '@/types/pelicula';
import { peliculas } from '@/data/data';
import { serviceConsume } from '@/services/api';
const n = (v: string) => v.trim().replace(/\s+/g, ' ').toLowerCase();
const initialState: Movie[] =  [];
export const obtenerPeliculas = createAsyncThunk<Movie[],void,{ rejectValue: string }>(
  'movie/obtenerPeliculas',
  async (_, { rejectWithValue }) => {
    try {
      const resultado =
        await serviceConsume.obtenerListadoPeliculas(null);

      if (!Array.isArray(resultado)) {
        return rejectWithValue(
          'La API no devolvió un arreglo de películas',
        );
      }

      return resultado;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las películas',
      );
    }
  },
);

export const guardarPelicula = createAsyncThunk<Movie,Omit<Movie, 'id'>,{ rejectValue: string }>(
  'movie/guardarPelicula',
  async (pelicula, { rejectWithValue }) => {
    try {
      return await serviceConsume.guardarPelicula(pelicula);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la película',
      );
    }
  },
);

export const actualizarPelicula = createAsyncThunk<
  Movie,
  Movie,
  { rejectValue: string }
>(
  'movie/actualizarPelicula',
  async (pelicula, { rejectWithValue }) => {
    try {
      return await serviceConsume.actualizarPelicula(pelicula);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la película',
      );
    }
  },
);

 /*peliculas.map((p: any) => ({
  ...p,
  clasificacion: p.clasificacion ?? 'PG-13',
  sala: p.sala ?? 'Sala 1',
  precio: p.precio ?? 5.0,
}));*/
const slice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    addMovie: (s, a: PayloadAction<Omit<Movie, 'id'> & { id?: number }>) => {
      const { id, ...d } = a.payload;
      if (s.some((m) => n(m.nombre) === n(d.nombre))) return;
      s.push({ id: id ?? Date.now(), ...d } as Movie);
    },
    updateMovie: (s, a: PayloadAction<Movie>) => {
      if (
        s.some(
          (m) => m.id !== a.payload.id && n(m.nombre) === n(a.payload.nombre),
        )
      )
        return;
      const i = s.findIndex((m) => m.id === a.payload.id);
      if (i >= 0) s[i] = a.payload;
    },
    deleteMovie: (s, a: PayloadAction<number>) =>
      s.filter((m) => m.id !== a.payload),
    toggleStatus: (s, a: PayloadAction<number>) => {
      const m = s.find((x) => x.id === a.payload);
      if (m)
        m.estado = m.estado === 'Disponible' ? 'No disponible' : 'Disponible';
    },
  },
   extraReducers: (builder) => {
    builder.addCase(obtenerPeliculas.fulfilled, (_, action) => {
      return action.payload;
    })
    .addCase(guardarPelicula.fulfilled, (state, action) => {
      state.push(action.payload);
    })
    .addCase(actualizarPelicula.fulfilled, (state, action) => {  const pelicula = action.payload;
                                                                const index = state.findIndex((m) => m.id === pelicula.id);
                                                                if (index >= 0) { state[index] = { ...state[index],...pelicula,};}});
  },
});
export const { addMovie, updateMovie, deleteMovie, toggleStatus } =
  slice.actions;
export default slice.reducer;
