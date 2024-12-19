import Axios from 'axios';
import { useEffect, useState } from 'react';
import './styles/App.css';

function Productos() {
    // Estados para productos
    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcionProducto, setDescripcionProducto] = useState("");
    const [precioProducto, setPrecioProducto] = useState("");
    const [contenidoProducto, setContenidoProducto] = useState(""); // Contenido del producto
    const [cantidadUnidadesProducto, setCantidadUnidadesProducto] = useState(""); // Cantidad de unidades del producto
    const [imagenProducto, setImagenProducto] = useState(""); // Imagen del producto
    const [idProducto, setIdProducto] = useState("");
    const [editarProducto, setEditarProducto] = useState(false);
    const [listaProductos, setProductos] = useState([]);

    // Función para obtener productos al cargar el componente
    useEffect(() => {
        getProductos();
    }, []);

    // Funciones para productos
    const addProducto = () => {
        if (
            nombreProducto.trim() === "" ||
            precioProducto.trim() === "" ||
            contenidoProducto.trim() === "" ||
            cantidadUnidadesProducto.trim() === "" ||
            imagenProducto.trim() === ""
        ) {
            alert("Por favor, completa todos los campos del producto.");
            return;
        }

        Axios.post("http://localhost:3001/createProducto", {
            nombre: nombreProducto,
            descripcion: descripcionProducto,
            precio: precioProducto,
            contenido: contenidoProducto,
            cantidadUnidades: cantidadUnidadesProducto,
            imagen: imagenProducto, // Incluir la imagen
        }).then(() => {
            alert("Producto Registrado");
            limpiarDatosProducto();
            getProductos(); // Obtener la lista actualizada de productos
        }).catch((error) => {
            console.error("Error al registrar producto:", error);
        });
    }

    const updateProducto = () => {
        Axios.put("http://localhost:3001/updateProducto", {
            cod: idProducto,
            nombre: nombreProducto,
            descripcion: descripcionProducto,
            precio: precioProducto,
            contenido: contenidoProducto,
            cantidadUnidades: cantidadUnidadesProducto,
            imagen: imagenProducto, // Incluir la imagen
        }).then(() => {
            getProductos();
            alert("Producto Actualizado");
            limpiarDatosProducto();
        }).catch((error) => {
            console.error("Error al actualizar producto:", error);
        });
    }

    const deleteProducto = (id) => {
        Axios.delete(`http://localhost:3001/deleteProducto/${id}`).then(() => {
            getProductos();
            alert("Producto Eliminado");
            limpiarDatosProducto();
        }).catch((error) => {
            console.error("Error al eliminar producto:", error);
        });
    }

    const limpiarDatosProducto = () => {
        setNombreProducto("");
        setDescripcionProducto("");
        setPrecioProducto("");
        setContenidoProducto(""); // Limpiar contenido
        setCantidadUnidadesProducto(""); // Limpiar cantidad de unidades
        setImagenProducto(""); // Limpiar imagen
        setEditarProducto(false);
    }

    const editarProductoFunc = (val) => {
        setEditarProducto(true);
        setNombreProducto(val.nombre);
        setDescripcionProducto(val.descripcion);
        setPrecioProducto(val.precio);
        setContenidoProducto(val.contenido); // Establecer contenido para editar
        setCantidadUnidadesProducto(val.cantidadUnidades); // Establecer cantidad de unidades para editar
        setImagenProducto(val.imagen); // Establecer imagen para editar
        setIdProducto(val.cod);
    }

    const getProductos = () => {
        Axios.get("http://localhost:3001/productos").then((response) => {
            setProductos(response.data);
        }).catch((error) => {
            console.error("Error al obtener productos:", error);
        });
    }

    return (
        <div className='App'>
            <div className='datos'>
                <label>Nombre del Producto: 
                    <input
                        type="text"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                        placeholder="Ingresa el nombre del producto"
                    />
                </label>

                <label>Descripción del Producto: 
                    <input
                        type="text"
                        value={descripcionProducto}
                        onChange={(e) => setDescripcionProducto(e.target.value)}
                        placeholder="Ingresa la descripción del producto"
                    />
                </label>

                <label>Precio del Producto: 
                    <input
                        type="text"
                        value={precioProducto}
                        onChange={(e) => setPrecioProducto(e.target.value)}
                        placeholder="Ingresa el precio del producto"
                    />
                </label>

                <label>Contenido del Producto: 
                    <input
                        type="text"
                        value={contenidoProducto}
                        onChange={(e) => setContenidoProducto(e.target.value)}
                        placeholder="Ingresa el contenido del producto"
                    />
                </label>

                <label>Cantidad de Unidades: 
                    <input
                        type="number"
                        value={cantidadUnidadesProducto}
                        onChange={(e) => setCantidadUnidadesProducto(e.target.value)}
                        placeholder="Ingresa la cantidad de unidades"
                    />
                </label>

                <label>Imagen del Producto: 
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImagenProducto(reader.result); // Establecer la imagen en Base64
                            };
                            if (file) {
                                reader.readAsDataURL(file); // Leer como Base64
                            }
                        }}
                    />
                </label>

                <div>
                    {
                        editarProducto ? (
                            <>
                                <button onClick={updateProducto}>Actualizar</button>
                                <button onClick={limpiarDatosProducto}>Cancelar</button>
                            </>
                        ) : (
                            <button onClick={addProducto}>Registrar</button>
                        )
                    }
                </div>
            </div>

            <div className="listaUsuarios">
                <table>
                    <thead>
                        <tr>
                            <th>Cod</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Contenido</th>
                            <th>Cantidad de Unidades</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaProductos.map((producto) => (
                            <tr key={producto.cod}>
                                <td>{producto.cod}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.contenido}</td>
                                <td>{producto.cantidadUnidades}</td>
                                <td>
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        style={{ width: '50px', height: '50px' }} 
                                    />
                                </td>
                                <td>
                                    <button onClick={() => editarProductoFunc(producto)}>Actualizar</button>
                                    <button onClick={() => deleteProducto(producto.cod)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Productos;
