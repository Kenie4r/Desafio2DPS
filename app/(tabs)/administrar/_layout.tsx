import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AdminLayout() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasHardware, setHasHardware] = useState(true);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    setHasHardware(hasHardware);

    const savedSettings = await LocalAuthentication.isEnrolledAsync();
    if (!savedSettings) {
      Alert.alert(
        'Sin huellas',
        'No hay datos biométricos configurados en este dispositivo.',
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acceso de personal',
      disableDeviceFallback: false,
    });

    setAuth(result.success);
  };

  useEffect(() => {
    //authenticate().finally(() => setLoading(true));
    setLoading(false);
    setAuth(true)
  }, []);

  if (loading) {
    return (
      <View style={authStyles.Center}>
        <Text style={authStyles.title}>Verificando autenticación...</Text>
      </View>
    );
  }

  if (!auth) {
    return (
      <View style={authStyles.container}>
        <Text style={authStyles.title}>Zona de Personal</Text>
        <Text style={authStyles.sub}>
          Autenticación biométrica requerida para continuar.
        </Text>
        {!hasHardware ? (
          <Text style={authStyles.warning}>
            Este dispositivo no soporta autenticación biométrica.
          </Text>
        ) : null}
        <TouchableOpacity style={authStyles.btn} onPress={authenticate}>
          <Text style={authStyles.btnText}>Autenticar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#166534' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Administrar' }} />
      <Stack.Screen
        name="peliculas"
        options={{ title: 'Gestión de Películas' }}
      />
      <Stack.Screen
        name="pelicula-add"
        options={{ title: 'Agregar Película' }}
      />
      <Stack.Screen name="[id]" options={{ title: 'Editar Película' }} />
      <Stack.Screen name="scanner" options={{ title: 'Validar Boleto' }} />
    </Stack>
  );
}

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  Center: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
  },
  sub: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  warning: {
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#166534',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
