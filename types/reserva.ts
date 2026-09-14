import { Seat } from './asiento';
export interface ticketsBuy {
  id?: string;
  movieId: number;
  theatherId: number;
  hour?: string;
  seats: Seat[];
  price: number;
  total?: number;
  estado: string;
}
