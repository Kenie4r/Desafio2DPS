import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import movie from './slices/peliculasSlices';
import movieTheater from './slices/salasSlice';
import selectmovieTheather from './slices/selectSalaSlice';
import reservation from './slices/reservaSlice';
import compras from './slices/comprassSlice';
import categoria from './slices/categoriaSlice'

const rootReducer = combineReducers({
  movie,
  movieTheater,
  selectmovieTheather,
  reservation,
  compras,
  categoria,
});
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['movie', 'movieTheater', 'compras'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (g) =>
    g({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// YA NO uses export default store;
