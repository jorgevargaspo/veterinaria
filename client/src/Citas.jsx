import React, { useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import './styles/Citas.css';

function Citas() {
    const [state, setState] = useState({
        fecha: "",
        hora: "",
        id_mascota: "",
        id_usuario: "",
        especie: "",
        nivel_urgencia: "bajo",
        editar: false,
        id: "",
        listaCitas: [],
        listaMascotas: [],
        listaUsuarios: []
    });

    const fetchData = useCallback(async () => {
        try {
            const [citas, mascotas, usuarios] = await Promise.all([
                Axios.get("http://localhost:3001/citas"),
                Axios.get("http://localhost:3001/mascotas"),
                Axios.get("http://localhost:3001/usuarios")
            ]);

            setState(prev => ({
                ...prev,
                listaCitas: citas.data,
                listaMascotas: mascotas.data,
                listaUsuarios: usuarios.data
            }));
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    const handleChange = (field, value) => {
        setState(prev => ({ ...prev, [field]: value }));
    };

    const validarCampos = () => {
        const camposRequeridos = ['fecha', 'hora', 'id_mascota', 'id_usuario', 'especie'];
        const camposVacios = camposRequeridos.filter(campo => !state[campo].trim());
        
        if (camposVacios.length) {
            alert(`Campos requeridos: ${camposVacios.join(', ')}`);
            return false;
        }
        return true;
    };

    const verificarCitaExistente = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/citas");
            return response.data.some(
                cita => cita.fecha === state.fecha && 
                        cita.hora === state.hora && 
                        cita.id !== state.id
            );
        } catch (error) {
            console.error("Error verificando cita:", error);
            return false;
        }
    };

    const add = async () => {
        if (!validarCampos()) return;
        
        const citaExistente = await verificarCitaExistente();
        if (citaExistente) {
            alert("Esta cita ya existe");
            return;
        }

        try {
            await Axios.post("http://localhost:3001/createCitas", {
                fecha: state.fecha,
                hora: state.hora,
                id_mascota: state.id_mascota,
                id_usuario: state.id_usuario,
                especie: state.especie,
                nivel_urgencia: state.nivel_urgencia
            });
            
            alert("Cita Registrada");
            limpiarDatos();
            fetchData();
        } catch (error) {
            console.error("Error registrando cita:", error);
        }
    };

    const updateCita = async () => {
        if (!validarCampos()) return;

        try {
            await Axios.put(`http://localhost:3001/updateCitas/${state.id}`, {
                fecha: state.fecha,
                hora: state.hora,
                id_mascota: state.id_mascota,
                id_usuario: state.id_usuario,
                especie: state.especie,
                nivel_urgencia: state.nivel_urgencia
            });
            
            alert("Cita Actualizada");
            limpiarDatos();
            fetchData();
        } catch (error) {
            console.error("Error actualizando cita:", error);
        }
    };

    const deleteCita = async (id) => {
        try {
            await Axios.delete(`http://localhost:3001/deleteCitas/${id}`);
            alert("Cita Eliminada");
            fetchData();
        } catch (error) {
            console.error("Error eliminando cita:", error);
        }
    };

    const editarCitas = (val) => {
        setState(prev => ({
            ...prev,
            fecha: val.fecha,
            hora: val.hora,
            id_mascota: val.id_mascota,
            id_usuario: val.id_usuario,
            especie: val.especie,
            nivel_urgencia: val.nivel_urgencia,
            editar: true,
            id: val.id
        }));
    };

    const limpiarDatos = () => {
        setState(prev => ({
            ...prev,
            fecha: "",
            hora: "",
            id_mascota: "",
            id_usuario: "",
            especie: "",
            nivel_urgencia: "bajo",
            editar: false,
            id: ""
        }));
    };

    return (
        <div className='App'>
            <h2>Registrar / Gestionar Citas</h2>
            
            <div className='datos'>
                <label>Fecha: 
                    <input 
                        value={state.fecha} 
                        onChange={(e) => handleChange('fecha', e.target.value)}
                        type="date" 
                    />
                </label>

                <label>Hora: 
                    <input 
                        value={state.hora} 
                        onChange={(e) => handleChange('hora', e.target.value)}
                        type="time" 
                    />
                </label>

                <label>Mascota: 
                    <select 
                        value={state.id_mascota} 
                        onChange={(e) => handleChange('id_mascota', e.target.value)}
                    >
                        <option value="">Selecciona una mascota</option>
                        {state.listaMascotas.map(mascota => (
                            <option key={mascota.id} value={mascota.id}>
                                {mascota.nombre} ({mascota.tipo})
                            </option>
                        ))}
                    </select>
                </label>

                <label>Usuario: 
                    <select 
                        value={state.id_usuario} 
                        onChange={(e) => handleChange('id_usuario', e.target.value)}
                    >
                        <option value="">Selecciona un usuario</option>
                        {state.listaUsuarios.map(usuario => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label>Especie: 
                    <input 
                        value={state.especie} 
                        onChange={(e) => handleChange('especie', e.target.value)} 
                        type="text" 
                        placeholder="Especie de la mascota" 
                    />
                </label>

                <label>Nivel de urgencia: 
                    <select 
                        value={state.nivel_urgencia} 
                        onChange={(e) => handleChange('nivel_urgencia', e.target.value)}
                    >
                        <option value="bajo">Bajo</option>
                        <option value="medio">Medio</option>
                        <option value="alto">Alto</option>
                    </select>
                </label>

                <div className="btn-container">
                    {state.editar ? (
                        <>
                            <button className="btn btn-update" onClick={updateCita}>Actualizar</button>
                            <button className="btn btn-delete" onClick={limpiarDatos}>Cancelar</button>
                        </>
                    ) : (
                        <button className="btn btn-update" onClick={add}>Registrar Cita</button>
                    )}
                </div>
            </div>

            <div className="listaCitas">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Mascota</th>
                            <th>Usuario</th>
                            <th>Especie</th>
                            <th>Nivel de urgencia</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.listaCitas.map((val) => {
                            const mascota = state.listaMascotas.find(m => m.id === val.id_mascota);
                            const usuario = state.listaUsuarios.find(u => u.id === val.id_usuario);
                            return (
                                <tr key={val.id}>
                                    <td>{val.id}</td>
                                    <td>{val.fecha}</td>
                                    <td>{val.hora}</td>
                                    <td>{mascota ? mascota.nombre : "No especificado"}</td>
                                    <td>{usuario ? usuario.nombre : "No especificado"}</td>
                                    <td>{val.especie}</td>
                                    <td>{val.nivel_urgencia}</td>
                                    <td>
                                        <div>
                                            <button className="btn btn-update" onClick={() => editarCitas(val)}>Actualizar</button>
                                            <button className="btn btn-delete" onClick={() => deleteCita(val.id)}>Eliminar</button>
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

export default Citas;