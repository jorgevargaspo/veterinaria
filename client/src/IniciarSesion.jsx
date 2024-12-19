import { useState, useEffect } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';

function IniciarSesion({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = () => {
    Axios.get('http://localhost:3002/usuarios')
      .then((response) => {
        setListaUsuarios(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
      });
  };

  const iniciarSesion = () => {
    if (!correo.trim() || !contrasena.trim()) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }
  
    const usuarioEncontrado = listaUsuarios.find(
      (usuario) =>
        usuario.correo === correo && usuario.contrasena === contrasena
    );
  
    if (usuarioEncontrado) {
      if (usuarioEncontrado.es_administrador) { // es_administrador como 1 o 0
        alert(`Bienvenido administrador, ${usuarioEncontrado.nombre}`);
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
        onLogin({ ...usuarioEncontrado, esAdmin: true }); // Propagar estado de administrador
      } else {
        alert(`Bienvenido, ${usuarioEncontrado.nombre}`);
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
        onLogin({ ...usuarioEncontrado, esAdmin: false }); // Usuario regular
      }
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  };
  

  const registrarse = () => {
    if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const usuarioExistente = listaUsuarios.find(
      (usuario) => usuario.correo === correo
    );
    if (usuarioExistente) {
      alert('El correo ya está registrado.');
      return;
    }

    Axios.post('http://localhost:3002/create', {
      nombre,
      correo,
      contrasena,
    })
      .then(() => {
        alert('Usuario registrado exitosamente.');
        setModoRegistro(false);
        limpiarCampos();
        getUsuarios();
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
      });
  };

  const limpiarCampos = () => {
    setNombre('');
    setCorreo('');
    setContrasena('');
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    heading: {
      fontSize: '24px',
      textAlign: 'center',
      marginBottom: '20px',
      color: '#4caf50',
    },
    label: {
      display: 'block',
      marginBottom: '15px',
    },
    input: {
      width: 'calc(100% - 10px)',
      padding: '10px',
      fontSize: '16px',
      marginTop: '5px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
    },
    button: {
      display: 'inline-block',
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#4caf50',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
    },
    buttonSecondary: {
      backgroundColor: '#2196f3',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    buttonSecondaryHover: {
      backgroundColor: '#1976d2',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{modoRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h1>

      {modoRegistro && (
        <label style={styles.label}>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
            style={styles.input}
          />
        </label>
      )}

      <label style={styles.label}>
        Correo:
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Ingresa tu correo"
          style={styles.input}
        />
      </label>

      <label style={styles.label}>
        Contraseña:
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Ingresa tu contraseña"
          style={styles.input}
        />
      </label>

      <div>
        {modoRegistro ? (
          <button style={styles.button} onClick={registrarse}>
            Registrarse
          </button>
        ) : (
          <button style={styles.button} onClick={iniciarSesion}>
            Iniciar Sesión
          </button>
        )}
        <button
          style={{
            ...styles.button,
            ...(modoRegistro ? styles.buttonSecondary : {}),
          }}
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro
            ? '¿Ya tienes una cuenta? Inicia Sesión'
            : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}

IniciarSesion.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default IniciarSesion;
