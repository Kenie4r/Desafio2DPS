import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import type { Movie } from '@/types/pelicula';

interface MovieFormProps {
  initial?: Partial<Movie>;
  isEditing: boolean;
  onSubmit: (data: Omit<Movie, 'id'> & { id?: number }) => void;
}

export default function MovieForm({
  initial,
  isEditing,
  onSubmit,
}: MovieFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [genre, setGenre] = useState(initial?.genre ?? '');
  const [duration, setDuration] = useState(initial?.duration ?? 120);
  const [status, setStatus] = useState(initial?.status ?? 'Disponible');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [clasificacion, setClasificacion] = useState(
    initial?.clasificacion ?? 'PG-13',
  );
  const [sala, setSala] = useState(initial?.sala ?? 'Sala 1');
  const [precio, setPrecio] = useState(initial?.precio ?? 5.0);

  const handleSubmit = () => {
    if (!title.trim() || !genre.trim() || !sala.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Completa todos los campos requeridos.',
      );
      return;
    }

    onSubmit({
      id: initial?.id,
      title,
      genre,
      duration: Number(duration),
      status,
      description,
      author,
      image,
      clasificacion,
      sala,
      precio: Number(precio),
    });
  };

  return (
    <View>
      <Text style={st.label}>Nombre *</Text>
      <TextInput
        style={st.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nombre de la película"
      />

      <Text style={st.label}>Género *</Text>
      <TextInput
        style={st.input}
        value={genre}
        onChangeText={setGenre}
        placeholder="Ej: Acción, Drama, Comedia"
      />

      <Text style={st.label}>Duración (min) *</Text>
      <TextInput
        style={st.input}
        value={String(duration)}
        onChangeText={(v) => setDuration(Number(v) || 0)}
        placeholder="120"
        keyboardType="numeric"
      />

      <Text style={st.label}>Estado *</Text>
      <View style={st.row}>
        {(['Disponible', 'Próximamente', 'No disponible'] as const).map(
          (opt) => (
            <TouchableOpacity
              key={opt}
              style={[st.chip, status === opt && st.chipActive]}
              onPress={() => setStatus(opt)}
            >
              <Text style={[st.chipText, status === opt && st.chipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <Text style={st.label}>Clasificación *</Text>
      <TextInput
        style={st.input}
        value={clasificacion}
        onChangeText={setClasificacion}
        placeholder="Ej: PG-13, R, PG"
      />

      <Text style={st.label}>Sala Asignada *</Text>
      <TextInput
        style={st.input}
        value={sala}
        onChangeText={setSala}
        placeholder="Ej: Sala 1, Sala 2"
      />

      <Text style={st.label}>Precio de Entrada ($) *</Text>
      <TextInput
        style={st.input}
        value={String(precio)}
        onChangeText={(v) => setPrecio(Number(v) || 0)}
        placeholder="5.0"
        keyboardType="numeric"
      />

      <Text style={st.label}>Autor *</Text>
      <TextInput
        style={st.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Director/Directora"
      />

      <Text style={st.label}>URL de Imagen *</Text>
      <TextInput
        style={st.input}
        value={image}
        onChangeText={setImage}
        placeholder="https://..."
      />

      <Text style={st.label}>Descripción</Text>
      <TextInput
        style={[st.input, st.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Sinopsis de la película..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={st.saveBtn} onPress={handleSubmit}>
        <Text style={st.saveBtnText}>
          {isEditing ? 'Guardar Cambios' : 'Agregar Película'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#166534',
    borderColor: '#166534',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#fff',
  },
  saveBtn: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
