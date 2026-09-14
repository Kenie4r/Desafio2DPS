import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ticketsBuy } from '@/types/reserva';

const generateTicketId = (purchase: ticketsBuy) => {
  const seats = purchase.seats.map((seat) => seat.name).join('|');
  return `${purchase.movieId}-${purchase.theatherId}-${purchase.hour ?? 'sin-hora'}-${seats}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
};

const slice = createSlice({
  name: 'compras',
  initialState: [] as ticketsBuy[],
  reducers: {
    agregarCompra: (s, a: PayloadAction<ticketsBuy>) => {
      const payload = {
        ...a.payload,
        id: a.payload.id ?? generateTicketId(a.payload),
        estado: a.payload.estado ?? 'completada',
      };
      s.push(payload);
    },
    eliminarCompra: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      const index = s.findIndex(
        (c) =>
          (c.id ?? `${c.movieId}-${c.theatherId}-${c.hour ?? 'sin-hora'}-${c.seats.map((x) => x.name).join('|')}`) ===
          id,
      );
      if (index >= 0) {
        s.splice(index, 1);
      }
    },
    marcarComoUsada: (
      s,
      a: PayloadAction<{
        movieId: number;
        theatherId: number;
        hour?: string;
        seatName?: string;
      }>,
    ) => {
      const compra = s.find(
        (c) =>
          c.movieId === a.payload.movieId &&
          c.theatherId === a.payload.theatherId &&
          c.hour === a.payload.hour &&
          c.estado !== 'usada',
      );

      if (!compra) return;

      if (a.payload.seatName) {
        const asiento = compra.seats.find((x) => x.name === a.payload.seatName);
        if (asiento) asiento.status = 'usada';

        if (compra.seats.every((x) => x.status === 'usada')) {
          compra.estado = 'usada';
        }

        return;
      }

      compra.estado = 'usada';
      compra.seats.forEach((x) => {
        x.status = 'usada';
      });
    },
  },
});

export const { agregarCompra, eliminarCompra, marcarComoUsada } = slice.actions;
export default slice.reducer;
