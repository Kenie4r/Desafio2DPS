import { peliculas } from './data';
import type { MovieTheather } from '@/types/Sala';
import type { Seat } from '@/types/asiento';

const seatPatterns: string[][] = [
  [
    'activo',
    'activo',
    'activo',
    'activo',
    'activo',
    'inactivo',
    'activo',
    'activo',
    'activo',
    'activo',
    'activo',
    'activo',
    'activo',
    'activo',
  ],
];

export const defaultHours = ['14:00', '16:30', '19:00', '21:30'];

const buildLine = (lineNumber: string, pattern: string[], variant: number) => ({
  lineNumber,
  seats: pattern.map((status, index) => ({
    status: status as Seat['status'],
    preferential: [2, 7, 11].includes(index) || (index + variant) % 4 === 0,
    name: `${lineNumber}${index + 1}`,
  })),
});

const buildSala = (
  movieId: number,
  theaterNumber: number,
  variant: number,
  hour: string,
): MovieTheather => ({
  movieId,
  MovieTheaterNumber: theaterNumber,
  hour,
  lines: ['A', 'B', 'C', 'D', 'E'].map((lineNumber, index) =>
    buildLine(
      lineNumber,
      seatPatterns[(variant + index) % seatPatterns.length],
      variant + index,
    ),
  ),
});

export const buildSalasForMovie = (
  movieId: number,
  theaterNumberBase = 1,
  hours = defaultHours,
): MovieTheather[] =>
  hours.map((hour, index) =>
    buildSala(movieId, theaterNumberBase + index, index, hour),
  );

export const salasData = peliculas.flatMap((pelicula, movieIndex) =>
  buildSalasForMovie(pelicula.id, movieIndex * 10 + 1),
);
