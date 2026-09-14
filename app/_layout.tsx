import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store'; // Ambos con llaves
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </PersistGate>
    </Provider>
  );
}
