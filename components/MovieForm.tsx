import { useState,useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,StyleSheet,} from 'react-native';
import type { Movie } from '@/types/pelicula';
import type { Categoria } from '@/types/categoria';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { obtenerCategorias } from '@/redux/slices/categoriaSlice';

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
  const [title, setTitle] = useState(initial?.nombre ?? '');
  const [genre, setGenre] = useState<Categoria >({id: initial?.id??0,descripcion: '' });
  const [duration, setDuration] = useState(initial?.duracion ?? 120);
  const [status, setStatus] = useState(initial?.estado ?? 'ACTIVO');
  //const [description, setDescription] = useState(initial?.description ?? '');
  //const [author, setAuthor] = useState(initial?.author ?? '');
  const [image, setImage] = useState(initial?.url_image ?? '');
  const [clasificacion, setClasificacion] = useState(initial?.clasificacion ?? 'PG-13',);
  const [sala, setSala] = useState(initial?.sala ?? 'Sala 1');
  const [precio, setPrecio] = useState(initial?.precio ?? 5.0);
  const [codPelicula, setCodPelicula] = useState(initial?.codigo_pelicula  ?? 'PEL00004');


  const d = useAppDispatch();
  const categorias = useAppSelector((s) => s.categoria);

  useEffect(() => {void d(obtenerCategorias()).unwrap().catch((error) => console.error(error))}, [d]);

  const handleSubmit = () => {
    if (!title.trim() //|| !genre.trim()
     || !sala.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Completa todos los campos requeridos.',
      );
      return;
    }

    onSubmit({
      id: initial?.id ?? 0,
      codigo_pelicula:codPelicula,
      nombre: title,
      genero_id: genre?.id,
      duracion: Number(duration),
      estado: status.toUpperCase(),
      //description,
      //author,
      url_image: image,
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

      
      {/*
      <Text style={st.label}>Género *</Text>
      <TextInput
        style={st.input}
        value={genre}
        onChangeText={setGenre}
        placeholder="Ej: Acción, Drama, Comedia"
      />*/}

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
        {(['Activo', 'Inactivo'] as const).map(
          (opt) => (
            <TouchableOpacity
              key={opt}
              style={[st.chip, status === opt.toUpperCase() && st.chipActive]}
              onPress={() => setStatus(opt)}
            >
              <Text style={[st.chipText, status === opt.toUpperCase() && st.chipTextActive]}>
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

      <Text style={st.label}>Codigo de Pelicula *</Text>
      <TextInput
        style={st.input}
        value={codPelicula}
        onChangeText={setCodPelicula}
        placeholder="Codigo de pelicula"
      />

      <Text style={st.label}>URL de Imagen *</Text>
      <TextInput
        style={st.input}
        value={image}
        onChangeText={setImage}
        placeholder="https://..."
      />

    <Text style={st.label}>Categoria</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {categorias.map((categoria) => (
        <TouchableOpacity key={categoria.id} onPress={() => setGenre(categoria)} style={{padding: 12,borderRadius: 8,backgroundColor:genre.id === categoria.id ? '#166534' : '#e5e7eb',}}>
        <Text style={{color: genre.id === categoria.id ? '#fff' : '#111', }}>
        {categoria.descripcion}
      </Text>
    </TouchableOpacity>
  ))}
</View>

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
