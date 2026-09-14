import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MovieTheather } from '@/types/Sala';
import type { Seat } from '@/types/asiento';
const initialValue: MovieTheather = {
  lines: [],
  movieId: 0,
  MovieTheaterNumber: 0,
  hour: '',
};
const slice = createSlice({
  name: 'selectMovieTheater',
  initialState: initialValue,
  reducers: {
    seleccionar: (_s, a: PayloadAction<MovieTheather>) => a.payload,
    usarAsiento: (s, a: PayloadAction<Seat>) => {
      const l = s.lines.find((v) => v.lineNumber === a.payload.name[0]);
      const x = l?.seats.find((v) => v.name === a.payload.name);
      if (x && x.status !== 'inactivo')
        x.status = x.status === 'activo' ? 'seleccionado' : 'activo';
    },
    limpiarAsientos: (s, a: PayloadAction<Seat>) => {
      const l = s.lines.find((v) => v.lineNumber === a.payload.name[0]);
      const x = l?.seats.find((v) => v.name === a.payload.name);
      if (x && x.status !== 'inactivo') x.status = 'activo';
    },
    cerrarAsiento: (s, a: PayloadAction<Seat>) => {
      const l = s.lines.find((v) => v.lineNumber === a.payload.name[0]);
      const x = l?.seats.find((v) => v.name === a.payload.name);
      if (x) x.status = 'inactivo';
    },
  },
});
export const { seleccionar, usarAsiento, limpiarAsientos, cerrarAsiento } =
  slice.actions;
export default slice.reducer;
