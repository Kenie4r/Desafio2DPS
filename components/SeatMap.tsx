import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import type { MovieTheather } from '@/types/Sala';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usarAsiento } from '@/redux/slices/selectSalaSlice';
import { seleccionAsiento } from '@/redux/slices/reservaSlice';
export default function SeatMap({ sala }: { sala: MovieTheather }) {
  const d = useAppDispatch();
  const selected = useAppSelector((s) => s.reservation.seats);
  return (
    <ScrollView horizontal>
      <View style={st.wrap}>
        <Text style={st.screen}>PANTALLA</Text>
        {sala.lines.map((line) => (
          <View style={st.row} key={line.lineNumber}>
            <Text style={st.rowName}>{line.lineNumber}</Text>
            {line.seats.map((seat) => {
              const isSel =
                selected.some((x) => x.name === seat.name) ||
                seat.status === 'seleccionado';
              const bg =
                seat.status === 'inactivo'
                  ? '#16a34a'
                  : isSel
                    ? '#16a34a'
                    : seat.status === 'preseleccionado'
                      ? '#2563eb'
                      : '#6b7280';
              return (
                <Pressable
                  key={seat.name}
                  disabled={seat.status === 'inactivo'}
                  onPress={() => {
                    if (seat.status === 'inactivo' || seat.status === 'usada') {
                      Alert.alert('Asiento ocupado', 'Selecciona otro asiento.');
                      return;
                    }

                    d(usarAsiento(seat));
                    d(
                      seleccionAsiento({
                        ...seat,
                        status: isSel ? 'activo' : 'seleccionado',
                      }),
                    );
                  }}
                  style={[
                    st.seat,
                    {
                      backgroundColor: bg,
                      borderRadius: seat.preferential ? 14 : 7,
                    },
                  ]}
                >
                  <Text style={st.seatText}>{seat.name}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const st = StyleSheet.create({
  wrap: { padding: 16 },
  screen: {
    textAlign: 'center',
    backgroundColor: '#374151',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowName: { width: 22, fontWeight: '700' },
  seat: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  seatText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
