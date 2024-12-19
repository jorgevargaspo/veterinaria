import Axios from 'axios';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './styles/Ventas.css';
import logoFactura from './assets/logoFactura.jpg';

function Ventas() {
    const [busqueda, setBusqueda] = useState("");
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [factura, setFactura] = useState(null);
    const [nit, setNit] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = () => {
        Axios.get("http://localhost:3001/productos")
            .then((response) => {
                setListaProductos(response.data);
                setProductosFiltrados(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener productos:", error);
            });
    };

    const buscarProducto = (e) => {
        setBusqueda(e.target.value);
        const productosFiltrados = listaProductos.filter((producto) =>
            producto.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setProductosFiltrados(productosFiltrados);
    };

    const seleccionarProducto = (producto) => {
        const existe = productosSeleccionados.find((p) => p.cod === producto.cod);
        if (existe) {
            alert("El producto ya está en la lista de venta.");
            return;
        }
        setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
    };

    const actualizarCantidad = (cod, cantidad) => {
        setProductosSeleccionados(
            productosSeleccionados.map((producto) => {
                if (producto.cod === cod) {
                    if (cantidad > producto.cantidadUnidades) {
                        alert(`La cantidad no puede exceder el stock disponible (${producto.cantidadUnidades}).`);
                        return producto;
                    }
                    return { ...producto, cantidad: parseInt(cantidad) || 1 };
                }
                return producto;
            })
        );
    };

    const eliminarProductoSeleccionado = (cod) => {
        setProductosSeleccionados(productosSeleccionados.filter((producto) => producto.cod !== cod));
    };

    const validarStockAntesDeVenta = () => {
        for (const producto of productosSeleccionados) {
            if (producto.cantidad > producto.cantidadUnidades) {
                alert(`El producto "${producto.nombre}" excede el stock disponible (${producto.cantidadUnidades}).`);
                return false;
            }
        }
        return true;
    };

    const generarFactura = () => {
        if (!nit || !nombreCliente) {
            alert("Por favor, ingresa el NIT y el nombre del cliente.");
            return;
        }

        if (!validarStockAntesDeVenta()) {
            return;
        }

        const total = productosSeleccionados.reduce(
            (acc, producto) => acc + producto.precio * producto.cantidad,
            0
        );
        const fecha = new Date().toLocaleString();

        const detallesFactura = {
            nit,
            nombreCliente,
            productos: productosSeleccionados,
            total,
            fecha,
        };
        setFactura(detallesFactura);
        descargarPDF(detallesFactura);
    };

    const descargarPDF = (factura) => {
        const doc = new jsPDF();
        const imgWidth = 50;
        const imgHeight = 30;

        doc.addImage(logoFactura, 'PNG', 150, 10, imgWidth, imgHeight);
        doc.text("Factura de Venta Veterinaria Patito", 20, 20);
        doc.text(`Fecha: ${factura.fecha}`, 20, 30);
        doc.text(`NIT: ${factura.nit}`, 20, 40);
        doc.text(`Cliente: ${factura.nombreCliente}`, 20, 50);

        doc.autoTable({
            startY: 60,
            head: [["Producto", "Cantidad", "Precio Unitario (Bs)", "Subtotal (Bs)"]],
            body: factura.productos.map((producto) => [
                producto.nombre,
                producto.cantidad,
                producto.precio.toFixed(2),
                (producto.cantidad * producto.precio).toFixed(2),
            ]),
        });

        doc.text(`Total: ${factura.total.toFixed(2)} Bs`, 20, doc.lastAutoTable.finalY + 10);
        doc.save(`Factura_${factura.fecha}.pdf`);
    };

    return (
        <div className="ventas-container">
            <h2>Ventas de Productos</h2>
            <div className="busqueda-container">
                <input
                    type="text"
                    value={busqueda}
                    onChange={buscarProducto}
                    placeholder="Buscar producto..."
                    className="input-busqueda"
                />
            </div>

            <div className="resultados-busqueda">
                {productosFiltrados.length > 0 ? (
                    <div className="productos-grid">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.cod}
                                className="producto-card"
                                onClick={() => seleccionarProducto(producto)}
                            >
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="producto-imagen"
                                />
                                <div className="producto-info">
                                    <h4>{producto.nombre}</h4>
                                    <p>{producto.precio} Bs</p>
                                    <p>{producto.cantidadUnidades} en stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    busqueda && <p>No se encontraron productos.</p>
                )}
            </div>

            {productosSeleccionados.length > 0 && (
                <div className="detalle-venta">
                    <h3>Carrito de Ventas</h3>
                    {productosSeleccionados.map((producto) => (
                        <div key={producto.cod} className="producto-seleccionado">
                            <p>
                                <strong>{producto.nombre}</strong> - {producto.precio} Bs
                            </p>
                            <input
                                type="number"
                                value={producto.cantidad}
                                min="1"
                                max={producto.cantidadUnidades}
                                onChange={(e) => actualizarCantidad(producto.cod, e.target.value)}
                                className="input-cantidad"
                            />
                            <button 
                            onClick={() => eliminarProductoSeleccionado(producto.cod)} 
                            className="btn-eliminar"
                        >
                            Eliminar
                            </button>
                        </div>
                    ))}
                    <div className="factura-info">
                        <label>
                            NIT:
                            <input
                                type="text"
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                className="input-text"
                            />
                        </label>
                        <label>
                            Nombre del Cliente:
                            <input
                                type="text"
                                value={nombreCliente}
                                onChange={(e) => setNombreCliente(e.target.value)}
                                className="input-text"
                            />
                        </label>
                        <button onClick={generarFactura} className="btn-generar-factura">
                            Generar Factura
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ventas;
