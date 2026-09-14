import { Seat } from './asiento';
export interface Line {
  seats: Seat[];
  lineNumber: string;
}
