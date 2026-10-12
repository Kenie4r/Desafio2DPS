import type { Seat } from '@/types/asiento';

export type DatosQR = {
  numero_reserva?: string;
  asientos: Seat[];
  cod_pelicula: number;
};

export type NuevaReserva = {
  numero_reserva: string;
  codigo_qr: string;
  usuario_id: number;
  pelicula_id: number;
  nombre_cliente: string;
  documento: string;
  funcion: string;
  cantidad: number;
  total: number;
  utilizado: number;
};

export type ReservaAPI = NuevaReserva & {
  id: number;
};