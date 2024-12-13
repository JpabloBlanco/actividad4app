import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Tipo de navegación
type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Index'>;

const Index = () => {
  const [students, setStudents] = useState<any[]>([]); // Estado para los estudiantes
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigation = useNavigation<IndexScreenNavigationProp>(); // Navegación tipada

  // Cargar estudiantes
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/estudiante'); // Cambia localhost por tu IP si usas móvil
      const studentsArray = Object.values(response.data); // Convierte el objeto en un array
      setStudents(studentsArray);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Navegar a formulario para agregar/editar estudiante
  const handleNavigateToFormulario = (student?: any) => {
    navigation.navigate('Formulario', {
      student,
      onSave: fetchStudents, // Refrescar lista tras guardar
    });
  };

  // Eliminar estudiante
  const deleteStudent = async (cedula: string) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este estudiante?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:5000/api/estudiante/${cedula}`);
              setStudents(students.filter(student => student.cedula !== cedula));
            } catch (error) {
              console.error('Error al eliminar el estudiante:', error);
              Alert.alert('Error', 'No se pudo eliminar el estudiante.');
            }
          },
        },
      ]
    );
  };

  // Renderizar una fila de la tabla
  const renderRow = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.cedula}</Text>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.apellido}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.edad}</Text>
      <Text style={styles.cell}>{item.estado ? 'Activo' : 'Inactivo'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleNavigateToFormulario(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteStudent(item.cedula)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabla de Estudiantes</Text>

      <Button title="Agregar Estudiante" onPress={() => handleNavigateToFormulario()} />

      {/* Cabecera de la tabla */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cell}>Cédula</Text>
        <Text style={styles.cell}>Nombre</Text>
        <Text style={styles.cell}>Apellido</Text>
        <Text style={styles.cell}>Email</Text>
        <Text style={styles.cell}>Edad</Text>
        <Text style={styles.cell}>Estado</Text>
        <Text style={styles.cell}>Acción</Text>
      </View>

      {/* Cuerpo de la tabla */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.cedula}
          renderItem={renderRow}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default Index;
