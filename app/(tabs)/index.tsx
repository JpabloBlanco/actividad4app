import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

// Tipo de navegación
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "index"
>;

const Index = () => {
  const [students, setStudents] = useState<any[]>([]); // Estado para los estudiantes
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigation = useNavigation<IndexScreenNavigationProp>(); // Navegación tipada

  // Cargar estudiantes
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.1.32:5000/api/estudiante"
      ); // Cambia localhost por tu IP si usas móvil
      const studentsArray = Object.values(response.data); // Convierte el objeto en un array
      setStudents(studentsArray);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Navegar a formulario para agregar/editar estudiante
  const handleNavigateToFormulario = (student?: any) => {
    navigation.navigate("Formulario", {
      student,
      onSave: fetchStudents, // Refrescar lista tras guardar
    });
  };

  const deleteStudent = async (cedula: string) => {
    // Función para eliminar el estudiante después de la confirmación
    const handleDelete = async () => {
      try {
        // Realizar la solicitud DELETE para eliminar el estudiante
        await axios.delete(`http://192.168.1.32:5000/api/estudiante/${cedula}`);

        // Actualizar la lista de estudiantes eliminando al que tiene la cedula eliminada
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.cedula !== cedula)
        );

        // Mostrar mensaje de éxito
        Alert.alert("Éxito", "El estudiante ha sido eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
        Alert.alert("Error", "No se pudo eliminar el estudiante.");
      }
    };

    // Mostrar alerta de confirmación
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este estudiante?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: handleDelete }, // Llamar a handleDelete si se confirma
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
      <Text style={styles.cell}>{item.estado ? "Activo" : "Inactivo"}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleNavigateToFormulario(item)}
          style={styles.editButton}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteStudent(item.cedula)}
          style={styles.deleteButton}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabla de Usuario</Text>

      <Button
        title="Agregar Estudiante"
        onPress={() => handleNavigateToFormulario()}
      />

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
        <ActivityIndicator size="large" color="#FF6F61" />
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
    padding: 20,
    backgroundColor: "#FFF5F0", // Fondo cálido suave
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FF6F61", // Color principal cálido
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FF6F61", // Borde cálido
  },
  header: {
    backgroundColor: "#FFDAB9", // Fondo cálido para la cabecera
    borderBottomWidth: 2,
    borderBottomColor: "#FF6F61",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#555", // Color de texto suave
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#FF6F61", // Botón cálido
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#FF8C00", // Color de eliminación cálido
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Index;
