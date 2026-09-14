import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MovieTheather } from '@/types/Sala';
import { salasData, buildSalasForMovie } from '@/data/salasData';
const slice = createSlice({
  name: 'movieTheater',
  initialState: salasData as MovieTheather[],
  reducers: {
    cambioSala: (_s, a: PayloadAction<MovieTheather[]>) => a.payload,
    syncSelectedTheater: (s, a: PayloadAction<MovieTheather>) => {
      const x = a.payload;
      const i = s.findIndex(
        (v) =>
          v.movieId === x.movieId &&
          v.MovieTheaterNumber === x.MovieTheaterNumber &&
          v.hour === x.hour,
      );
      if (i >= 0) s[i] = x;
    },
    addTheatersForMovie: (s, a: PayloadAction<number>) => {
      s.push(...buildSalasForMovie(a.payload));
    },
    removeTheatersForMovie: (s, a: PayloadAction<number>) =>
      s.filter((x) => x.movieId !== a.payload),
  },
});
export const {
  cambioSala,
  syncSelectedTheater,
  addTheatersForMovie,
  removeTheatersForMovie,
} = slice.actions;
export default slice.reducer;
