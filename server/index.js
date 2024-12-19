const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión con la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "veterinaria",
  port: 3306,
});

// Middleware para verificar rol de administrador
function verificarAdministrador(req, res, next) {
  const { correo, contrasena } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND es_administrador = TRUE",
    [correo],
    async (err, result) => {
      if (err) {
        console.error("Error al verificar administrador:", err);
        return res.status(500).send("Error en el servidor");
      }

      if (result.length === 0) {
        return res.status(403).send("Acceso denegado. Solo administradores.");
      }

      // Verificar contraseña
      const usuario = result[0];
      const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!contrasenaValida) {
        return res.status(401).send("Contraseña incorrecta");
      }

      next();
    }
  );
}

// --- Usuarios ---
// Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  const { nombre, correo, contrasena, es_administrador } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  const hash = await bcrypt.hash(contrasena, 10);
  db.query(
    "INSERT INTO usuarios (nombre, correo, contrasena, es_administrador) VALUES (?, ?, ?, ?)",
    [nombre, correo, hash, es_administrador || false],
    (err, result) => {
      if (err) {
        console.error("Error al crear usuario:", err);
        return res.status(500).send("Error al crear usuario");
      }
      res.send({ message: "Usuario creado exitosamente" });
    }
  );
});

// Iniciar sesión
app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo],
    async (err, result) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).send("Error en el servidor");
      }

      if (result.length === 0) {
        return res.status(404).send("Usuario no registrado");
      }

      const usuario = result[0];
      const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!contrasenaValida) {
        return res.status(401).send("Contraseña incorrecta");
      }

      res.send({ message: "Inicio de sesión exitoso", usuario });
    }
  );
});

// Obtener todos los usuarios (solo para administradores)
app.get("/usuarios", verificarAdministrador, (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) {
      console.error("Error al cargar usuarios:", err);
      return res.status(500).send("Error al cargar usuarios");
    }
    res.send(result);
  });
});

// --- Productos ---
app.post("/productos", verificarAdministrador, (req, res) => {
  const { nombre, descripcion, precio, contenido, cantidadUnidades, imagen } = req.body;

  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, contenido, cantidadUnidades, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, contenido, cantidadUnidades, imagen],
    (err, result) => {
      if (err) {
        console.error("Error al crear producto:", err);
        return res.status(500).send("Error al crear producto");
      }
      res.send({ message: "Producto creado exitosamente" });
    }
  );
});

// --- Citas ---
app.post("/citas", (req, res) => {
  const { fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia } = req.body;

  db.query(
    "SELECT * FROM citas WHERE fecha = ? AND hora = ?",
    [fecha, hora],
    (err, result) => {
      if (err) {
        console.error("Error al verificar citas:", err);
        return res.status(500).send("Error en el servidor");
      }

      if (result.length > 0) {
        return res.status(400).send("Ya existe una cita en esa fecha y hora");
      }

      db.query(
        "INSERT INTO citas (fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia) VALUES (?, ?, ?, ?, ?, ?)",
        [fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia],
        (err, result) => {
          if (err) {
            console.error("Error al crear cita:", err);
            return res.status(500).send("Error al crear cita");
          }
          res.send({ message: "Cita creada exitosamente" });
        }
      );
    }
  );
});

// --- Configuración del servidor ---
app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
