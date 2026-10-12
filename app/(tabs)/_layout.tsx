import { useEffect } from 'react';
import { configurarNotificaciones } from '@/services/notificaciones';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store'; 
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  useEffect(() => {
    void configurarNotificaciones().catch((error) => {
      console.warn('No se pudieron configurar las notificaciones:', error);
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </PersistGate>
    </Provider>
  );
}
