import Axios from "axios";
import { useEffect, useState } from "react";
import "./styles/Usuarios.css";

function Usuarios() {
    // Estados para Usuarios
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [editar, setEditar] = useState(false);
    const [listaUsuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    useEffect(() => {
        getUsuarios();
    }, []);

    // Funciones para usuarios
    const add = () => {
        if (nombre.trim() === "" || correo.trim() === "" || contrasena.trim() === "") {
            mostrarMensaje("Por favor, completa todos los campos", "error");
            return;
        }
        Axios.post("http://localhost:3001/create", {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
        })
            .then(() => {
                mostrarMensaje("Usuario registrado exitosamente", "exito");
                limpiarDatos();
                getUsuarios();
            })
            .catch((error) => {
                mostrarMensaje("Error al registrar el usuario");
            });
    };

    const update = () => {
        if (!id) {
            mostrarMensaje("No se puede actualizar un usuario no seleccionado", "error");
            return;
        }
        Axios.put("http://localhost:3001/update", {
            id: id,
            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
        })
            .then(() => {
                mostrarMensaje("Usuario actualizado exitosamente", "exito");
                limpiarDatos();
                getUsuarios();
            })
            .catch((error) => {
                mostrarMensaje("Error al actualizar el usuario: " + error.message, "error");
            });
    };

    const deleteUser = (id) => {
        Axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                mostrarMensaje("Usuario eliminado exitosamente", "exito");
                getUsuarios();
            })
            .catch((error) => {
                mostrarMensaje("Error al eliminar el usuario: " + error.message, "error");
            });
    };

    const limpiarDatos = () => {
        setNombre("");
        setCorreo("");
        setContrasena("");
        setEditar(false);
        setId("");
    };

    const editarUsuario = (val) => {
        setEditar(true);
        setNombre(val.nombre);
        setCorreo(val.correo);
        setContrasena(val.contrasena);
        setId(val.id);
    };

    const getUsuarios = () => {
        Axios.get("http://localhost:3001/usuarios")
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                mostrarMensaje("Error al cargar los usuarios: " + error.message, "error");
            });
    };

    const mostrarMensaje = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
    };

    return (
        <div className="App">
            <div className="datos">
                {mensaje.texto && (
                    <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
                )}

                <label htmlFor="nombre">
                    Nombre:{" "}
                    <input
                        id="nombre"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        type="text"
                        placeholder="Ingresa tu nombre"
                    />
                </label>

                <label htmlFor="correo">
                    Correo electrónico:{" "}
                    <input
                        id="correo"
                        value={correo}
                        onChange={(event) => setCorreo(event.target.value)}
                        type="email"
                        placeholder="Ingresa tu correo"
                    />
                </label>

                <label htmlFor="contrasena">
                    Contraseña:{" "}
                    <input
                        id="contrasena"
                        value={contrasena}
                        onChange={(event) => setContrasena(event.target.value)}
                        type="password"
                        placeholder="Ingresa tu contraseña"
                    />
                </label>

                <div>
                    {editar ? (
                        <>
                            <button onClick={update}>Actualizar</button>
                            <button onClick={limpiarDatos}>Cancelar</button>
                        </>
                    ) : (
                        <button onClick={add}>Registrarse</button>
                    )}
                </div>
            </div>
            <div className="listaUsuarios">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Contraseña</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.map((val) => (
                            <tr key={val.id}>
                                <td>{val.id}</td>
                                <td>{val.nombre}</td>
                                <td>{val.correo}</td>
                                <td>{val.contrasena}</td>
                                <td>
                                    <div>
                                        <button onClick={() => editarUsuario(val)}>Actualizar</button>
                                        <button onClick={() => deleteUser(val.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Usuarios;
