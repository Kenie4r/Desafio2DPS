import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MovieTheather } from '@/types/Sala';
import type { ticketsBuy } from '@/types/reserva';
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
    liberarAsientoCompra: (s, a: PayloadAction<ticketsBuy>) => {
      const compra = a.payload;
      const theater = s.find(
        (v) =>
          v.movieId === compra.movieId &&
          v.MovieTheaterNumber === compra.theatherId &&
          v.hour === compra.hour,
      );

      if (!theater) return;

      compra.seats.forEach((seat) => {
        const line = theater.lines.find((v) => v.lineNumber === seat.name[0]);
        const found = line?.seats.find((v) => v.name === seat.name);
        if (found) {
          found.status = 'activo';
        }
      });
    },
  },
});

export const {
  cambioSala,
  syncSelectedTheater,
  addTheatersForMovie,
  removeTheatersForMovie,
  liberarAsientoCompra,
} = slice.actions;

export default slice.reducer;
