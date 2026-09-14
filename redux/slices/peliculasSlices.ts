import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from '@/types/pelicula';
import { peliculas } from '@/data/data';
const n = (v: string) => v.trim().replace(/\s+/g, ' ').toLowerCase();
const initialState: Movie[] = peliculas.map((p: any) => ({
  ...p,
  clasificacion: p.clasificacion ?? 'PG-13',
  sala: p.sala ?? 'Sala 1',
  precio: p.precio ?? 5.0,
}));
const slice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    addMovie: (s, a: PayloadAction<Omit<Movie, 'id'> & { id?: number }>) => {
      const { id, ...d } = a.payload;
      if (s.some((m) => n(m.title) === n(d.title))) return;
      s.push({ id: id ?? Date.now(), ...d } as Movie);
    },
    updateMovie: (s, a: PayloadAction<Movie>) => {
      if (
        s.some(
          (m) => m.id !== a.payload.id && n(m.title) === n(a.payload.title),
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
        m.status = m.status === 'Disponible' ? 'No disponible' : 'Disponible';
    },
  },
});
export const { addMovie, updateMovie, deleteMovie, toggleStatus } =
  slice.actions;
export default slice.reducer;
