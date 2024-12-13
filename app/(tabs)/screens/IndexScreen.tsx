import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IndexScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la aplicación CRUD</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Ir a Home"
          onPress={() => navigation.navigate('Home')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Crear Estudiante"
          onPress={() => navigation.navigate('Crear')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Ver Estudiantes"
          onPress={() => navigation.navigate('Listar')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Actualizar Estudiante"
          onPress={() => navigation.navigate('Actualizar')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Eliminar Estudiante"
          onPress={() => navigation.navigate('Eliminar')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
    width: '100%',
    maxWidth: 300,
  },
});
