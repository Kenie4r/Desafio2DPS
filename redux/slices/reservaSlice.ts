import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ticketsBuy } from '@/types/reserva';
import type { Seat } from '@/types/asiento';
const empty: ticketsBuy = {
  movieId: 0,
  price: 0,
  seats: [],
  theatherId: 0,
  hour: '',
  total: 0,
  estado: 'completada',
};
const slice = createSlice({
  name: 'reservation',
  initialState: empty,
  reducers: {
    iniciarReserva: (_s, a: PayloadAction<ticketsBuy>) => a.payload,
    seleccionAsiento: (s, a: PayloadAction<Seat>) => {
      const x = a.payload;
      if (x.status !== 'activo' && x.status !== 'seleccionado') return;
      const i = s.seats.findIndex((v) => v.name === x.name);
      i < 0 ? s.seats.push(x) : s.seats.splice(i, 1);
      s.price = s.seats.length * 3.5;
      s.total = s.price;
    },
    limpiarSeleccion: (s) => {
      s.seats = [];
      s.price = 0;
      s.total = 0;
    },
  },
});
export const { iniciarReserva, seleccionAsiento, limpiarSeleccion } =
  slice.actions;
export default slice.reducer;
