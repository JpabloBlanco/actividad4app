// ==============================
// Importar las dependencias
// ==============================
const express = require('express');
const admin = require('firebase-admin');

// ==============================
// Inicializar Firebase Admin SDK
// ==============================
const serviceAccount = require('./clave-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://appmultiplataformadb-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// ==============================
// Configurar Express
// ==============================
const app = express();
app.use(express.json()); 

// ==============================
// Rutas de la API
// ==============================

// Ruta para guardar datos
app.post('/api/estudiante', async (req, res) => {
  const { cedula, nombre, apellido, email, edad, estado } = req.body;

  // Validar parámetros
  if (!cedula || !nombre || !apellido || !email || !edad) {
    return res.status(400).json({
      error: "Faltan parámetros: 'cedula', 'nombre', 'apellido', 'email', y 'edad' son requeridos."
    });
  }

  try {
    // Guardar estudiante en Firebase
    await db.ref(`estudiantes/${cedula}`).set({
      nombre,
      apellido,
      email,
      edad,
      estado: estado || null
    });
    res.status(200).json({ message: "Estudiante guardado correctamente." });
  } catch (error) {
    res.status(500).json({
      error: `Error al guardar el estudiante: ${error.message}. Detalles: ${error.stack}`
    });
  }
});

// Ruta para obtener todos los estudiantes
app.get('/api/estudiante', async (req, res) => {
  try {
    const snapshot = await db.ref('estudiantes').once('value');
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ error: "No se encontraron estudiantes." });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error al obtener los estudiantes: ${error.message}. Detalles: ${error.stack}`
    });
  }
});

// Ruta para actualizar un estudiante
app.put('/api/estudiante/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const { nombre, apellido, email, edad, estado } = req.body;

  // Verificar si al menos uno de los campos a actualizar es proporcionado
  if (!nombre && !apellido && !email && !edad && estado === undefined) {
    return res.status(400).json({
      error: "Debe proporcionar al menos un campo para actualizar."
    });
  }

  try {
    const ref = db.ref(`estudiantes/${cedula}`);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      await ref.update({
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(email && { email }),
        ...(edad && { edad }),
        ...(estado !== undefined && { estado })
      });
      res.status(200).json({ message: "Estudiante actualizado correctamente." });
    } else {
      res.status(404).json({ error: "Estudiante no encontrado." });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error al actualizar el estudiante: ${error.message}. Detalles: ${error.stack}`
    });
  }
});

// Ruta para eliminar un estudiante
app.delete('/api/estudiante/:cedula', async (req, res) => {
  const { cedula } = req.params;

  try {
    const ref = db.ref(`estudiantes/${cedula}`);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      await ref.remove();
      res.status(200).json({ message: "Estudiante eliminado correctamente." });
    } else {
      res.status(404).json({ error: "Estudiante no encontrado." });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error al eliminar el estudiante: ${error.message}. Detalles: ${error.stack}`
    });
  }
});

// ==============================
// Iniciar el servidor
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
