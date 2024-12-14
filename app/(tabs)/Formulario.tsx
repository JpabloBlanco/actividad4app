import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Aquí importamos Picker desde el nuevo paquete
import { Picker } from "@react-native-picker/picker";
import { RouteProp } from "@react-navigation/native";

type FormularioScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Formulario"
>;

type FormularioScreenRouteProp = RouteProp<RootStackParamList, "Formulario">;

const Formulario = () => {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [estado, setEstado] = useState("1"); // Valor inicial como '1' (Activo)

  // Se obtiene la ruta y la navegación
  const route = useRoute<FormularioScreenRouteProp>(); // Aseguramos el tipo aquí
  const navigation = useNavigation<FormularioScreenNavigationProp>();

  const student = route.params?.student; // 'student' es opcional

  useEffect(() => {
    if (student) {
      setCedula(student.cedula);
      setNombre(student.nombre);
      setApellido(student.apellido);
      setEmail(student.email);
      setEdad(student.edad.toString());
      setEstado(student.estado === 1 ? "1" : "0"); // Mostrar 1 o 0 según el estado
    }
  }, [student]);

  // Función para agregar o actualizar el estudiante
  const handleSubmit = async () => {
    if (!cedula || !nombre || !apellido || !email || !edad) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (student) {
      // Si estamos editando
      try {
        await axios.put(`http://192.168.1.32:5000/api/estudiante/${cedula}`, {
          nombre,
          apellido,
          email,
          edad,
          estado: Number(estado), // Convertir a número al enviar
        });
        navigation.navigate("index"); // Redirigir al index después de actualizar
      } catch (error) {
        console.error("Error al actualizar el estudiante", error);
        Alert.alert("Error", "No se pudo actualizar el estudiante.");
      }
    } else {
      // Si estamos agregando
      try {
        await axios.post("http://192.168.1.32:5000/api/estudiante", {
          cedula,
          nombre,
          apellido,
          email,
          edad,
          estado: Number(estado), // Convertir a número al enviar
        });
        navigation.navigate("index"); // Redirigir al index después de agregar
      } catch (error) {
        console.error("Error al agregar el estudiante", error);
        Alert.alert("Error", "No se pudo agregar el estudiante.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {student ? "Editar Estudiante" : "Agregar Estudiante"}
      </Text>

      <TextInput
        placeholder="Cédula"
        value={cedula}
        onChangeText={setCedula}
        editable={!student} // No editable si estamos editando
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
        style={styles.input}
      />
      {/* Aquí cambiamos la entrada para que el usuario pueda seleccionar entre Activo/Inactivo */}
      <Picker
        selectedValue={estado}
        onValueChange={setEstado}
        style={styles.picker}
      >
        <Picker.Item label="Activo" value="1" />
        <Picker.Item label="Inactivo" value="0" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button
          title={student ? "Actualizar Estudiante" : "Agregar Estudiante"}
          onPress={handleSubmit}
        />
        <Button title="Regresar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F0", // Fondo cálido suave
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FF6F61", // Título con color cálido
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF6F61", // Borde cálido
    borderRadius: 8,
    fontSize: 16,
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FF6F61", // Borde cálido
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Formulario;
