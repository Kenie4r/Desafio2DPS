import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ReservaAPI } from '@/types/reservaApi';

const slice = createSlice({
  name: 'reservasApi',
  initialState: [] as ReservaAPI[],
  reducers: {
    cargarReservas: (_state, action: PayloadAction<ReservaAPI[]>) =>
      action.payload,

    guardarReserva: (state, action: PayloadAction<ReservaAPI>) => {
      const index = state.findIndex((r) => r.id === action.payload.id);

      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },

    quitarReserva: (state, action: PayloadAction<number>) =>
      state.filter((r) => r.id !== action.payload),
  },
});

export const { cargarReservas, guardarReserva, quitarReserva } = slice.actions;
export default slice.reducer;