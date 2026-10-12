import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CANAL_COMPRAS = 'compras-cine';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let configurando: Promise<boolean> | null = null;

async function solicitarPermiso(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  // Android 13 necesita un canal antes de solicitar el permiso.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_COMPRAS, {
      name: 'Compras de boletos',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#059669',
    });
  }
  let permisos = await Notifications.getPermissionsAsync();
  const permitido = () => permisos.granted ||
    permisos.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!permitido() && permisos.canAskAgain) {
    permisos = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: false },
    });
  }
  return permitido();
}

export function configurarNotificaciones(): Promise<boolean> {
  if (!configurando) {
    configurando = solicitarPermiso().finally(() => { configurando = null; });
  }
  return configurando;
}

type CompraNotificacion = {
  pelicula: string;
  cantidad: number;
  asientos: string[];
  total: number;
  codigo: string;
};

export async function notificarCompra(compra: CompraNotificacion): Promise<boolean> {
  if (!(await configurarNotificaciones())) return false;
  await Notifications.scheduleNotificationAsync({
    identifier: `compra-${compra.codigo}`,
    content: {
      title: '¡Compra de boletos confirmada!',
      body: `${compra.pelicula}\n${compra.cantidad} boleto(s) · Asientos: ${compra.asientos.join(', ')}\nTotal: $${compra.total.toFixed(2)} · Reserva: ${compra.codigo}`,
      sound: 'default',
      data: { numero_reserva: compra.codigo, tipo: 'compra' },
    },
    trigger: Platform.OS === 'android' ? { channelId: CANAL_COMPRAS } : null,
  });
  return true;
}
