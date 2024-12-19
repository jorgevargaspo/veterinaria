import Axios from 'axios';
import { useEffect, useState } from 'react';
import './styles/App.css';

function Mascotas() {
    // Estados para Mascotas
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState("");
    const [edad, setEdad] = useState("");
    const [id_usuario, setIdUsuario] = useState(""); // Se mantiene para el valor seleccionado
    const [editar, setEditar] = useState(false);
    const [listaMascotas, setMascotas] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]); // Nuevo estado para usuarios
    const [id, setId] = useState("");

    useEffect(() => {
        getMascotas();
        getUsuarios(); // Obtener usuarios al cargar el componente
    }, []);

    // Funciones para mascotas
    const add = () => {
        if (nombre.trim() === "" || especie.trim() === "" || edad.trim() === "" || id_usuario.trim() === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }
        Axios.post("http://localhost:3001/createMascota", {
            nombre: nombre,
            especie: especie,
            edad: edad,
            id_usuario: id_usuario
        }).then(() => {
            alert("Mascota Registrada");
            limpiarDatos();
            getMascotas();
        });
    }

    const update = () => {
        Axios.put("http://localhost:3001/updateMascota", {
            id: id,
            nombre: nombre,
            especie: especie,
            edad: edad,
            id_usuario: id_usuario
        }).then(() => {
            alert("Mascota Actualizada");
            limpiarDatos();
            getMascotas();
        });
    }

    const deleteMascota = (id) => {
        Axios.delete(`http://localhost:3001/deleteMascota/${id}`).then(() => {
            alert("Mascota Eliminada");
            limpiarDatos();
            getMascotas();
        });
    }

    const limpiarDatos = () => {
        setNombre("");
        setEspecie("");
        setEdad("");
        setIdUsuario("");
        setEditar(false);
    }

    const editarMascota = (val) => {
        setEditar(true);
        setNombre(val.nombre);
        setEspecie(val.especie);
        setEdad(val.edad);
        setIdUsuario(val.id_usuario); // Mantener el ID del usuario
        setId(val.id);
    }

    const getMascotas = () => {
        Axios.get("http://localhost:3001/mascotas").then((response) => {
            setMascotas(response.data);
        });
    }

    const getUsuarios = () => {
        Axios.get("http://localhost:3001/usuarios").then((response) => {
            setListaUsuarios(response.data); // Guardar la lista de usuarios
        });
    }

    return (
        <div className='App'>
            <div className='datos'>
                <label htmlFor="">Nombre: <input value={nombre} 
                    onChange={(event) => setNombre(event.target.value)}
                    type="text" placeholder="Ingresa el nombre de la mascota" /></label>

                <label htmlFor="">Especie: <input value={especie} 
                    onChange={(event) => setEspecie(event.target.value)}
                    type="text" placeholder="Ingresa la especie" /></label>

                <label htmlFor="">Edad: <input value={edad} 
                    onChange={(event) => setEdad(event.target.value)}
                    type="number" placeholder="Ingresa la edad" /></label>

                <label htmlFor="">ID Usuario: 
                    <select value={id_usuario} onChange={(event) => setIdUsuario(event.target.value)} className="id-usuario">
                        <option value="">Selecciona un usuario</option>
                        {listaUsuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} (ID: {usuario.id})
                            </option>
                        ))}
                    </select>
                </label>

                <div>
                    {editar ? (
                        <>
                            <button className="btn btn-update" onClick={update}>Actualizar</button>
                            <button className="btn btn-delete" onClick={limpiarDatos}>Cancelar</button>
                        </>
                    ) : (
                        <button className="btn btn-update" onClick={add}>Registrar Mascota</button>
                    )}
                </div>
            </div>

            <div className="listaMascotas">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Especie</th>
                            <th>Edad</th>
                            <th>ID Usuario</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaMascotas.map((val) => {
                            return (
                                <tr key={val.id}>
                                    <td>{val.id}</td>
                                    <td>{val.nombre}</td>
                                    <td>{val.especie}</td>
                                    <td>{val.edad}</td>
                                    <td>{val.id_usuario}</td>
                                    <td>
                                        <div>
                                            <button className="btn btn-update" onClick={() => editarMascota(val)}>Actualizar</button>
                                            <button className="btn btn-delete" onClick={() => deleteMascota(val.id)}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Mascotas;
