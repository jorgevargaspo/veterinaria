import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Mascotas from './Mascotas';
import Citas from './Citas';
import Ventas from './Ventas';
import Usuarios from './Usuarios'; // Importamos la vista Usuarios
import Productos from './Productos'; // Importamos la vista Productos
import IniciarSesion from './IniciarSesion';
import './styles/App.css';
import './styles/Footer.css';
import './styles/Header.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Función para manejar el inicio de sesión
  const login = (usuario) => {
    setIsAuthenticated(true);
    setUsuarioLogueado(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUsuarioLogueado(null);
    localStorage.removeItem('usuario');
  };

  return (
    <div className="App">
      <Header logout={logout} />
      <main>
        <ToastContainer />
        {!isAuthenticated ? (
          <IniciarSesion onLogin={login} />
        ) : (
          <>
            <div className="auth-actions">
              <button onClick={logout} className="btn">Cerrar sesión</button>
            </div>
            <Routes>
              <Route path="/inicio" element={<Home />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/mascotas" element={<Mascotas usuarioLogueado={usuarioLogueado} />} />
              <Route path="/citas" element={<Citas />} />

              {/* Rutas para Administradores */}
              {usuarioLogueado.esAdmin && (
                <>
                  <Route path="/usuarios" element={<Usuarios />} /> {/* Ruta para administrar usuarios */}
                  <Route path="/productos" element={<Productos />} /> {/* Ruta para administrar productos */}
                </>
              )}

              {/* Rutas para usuarios regulares */}
              {!usuarioLogueado.esAdmin && (
                <>
                  {/* Los usuarios regulares no pueden acceder a usuarios y productos */}
                  <Route path="/usuarios" element={<Navigate to="/inicio" />} />
                  <Route path="/productos" element={<Navigate to="/inicio" />} />
                </>
              )}

              <Route path="*" element={<Navigate to="/inicio" />} />
            </Routes>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
