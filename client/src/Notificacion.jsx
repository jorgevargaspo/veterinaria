import React from 'react';
import './styles/Notificacion.css'; // Estilos personalizados

function Notificacion({ mensaje, tipo }) {
    return (
        <div className={`notificacion ${tipo}`}>
            <p>{mensaje}</p>
        </div>
    );
}

export default Notificacion;
