import { createSlice, PayloadAction , createAsyncThunk,} from '@reduxjs/toolkit';
import type {Categoria} from '@/types/categoria';
import { serviceConsume } from '@/services/api';

const initialState: Categoria[] =  [];
export const obtenerCategorias = createAsyncThunk<Categoria[],void,{ rejectValue: string }>(
  'categoria/obtenerCategorias',
  async (_, { rejectWithValue }) => {
    try {
      const resultado =
        await serviceConsume.obtenerListadoCategoria();

      if (!Array.isArray(resultado)) {
        return rejectWithValue(
          'La API no devolvió un arreglo de categoria',
        );
      }

      return resultado;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las categoria',
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
  reducers: {},
    extraReducers: (builder) => {
    builder.addCase(obtenerCategorias.fulfilled, (_, action) => {
      return action.payload;
    })
  },
});

export default slice.reducer;
