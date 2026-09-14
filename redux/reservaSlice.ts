import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ticketsBuy } from '@/types/reserva';
const slice = createSlice({
  name: 'compras',
  initialState: [] as ticketsBuy[],
  reducers: {
    agregarCompra: (s, a: PayloadAction<ticketsBuy>) => {
      s.push(a.payload);
    },
  },
});
export const { agregarCompra } = slice.actions;
export default slice.reducer;
