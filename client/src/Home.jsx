import { useEffect, useState } from 'react';
import './styles/Home.css';

const Home = () => {
    const [dynamicText, setDynamicText] = useState('confiable');
    const [color, setColor] = useState('color1');

    useEffect(() => {
        const texts = [
            { text: 'confiable', color: 'color1' },
            { text: 'con experiencia', color: 'color2' },
            { text: 'amante de los animales', color: 'color3' },
            { text: 'familiar', color: 'color4' },
            { text: 'dedicada', color: 'color5' }
        ];
        let index = 0;

        const interval = setInterval(() => {
            index = (index + 1) % texts.length;
            setDynamicText(texts[index].text);
            setColor(texts[index].color);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="Home">
            <h1 className='Titulo'>Veterinaria Patito, una veterinaria <span className={color}>{dynamicText}</span></h1>
            <p>En Veterinaria Patito, somos especialistas en el cuidado y bienestar de tus mascotas. Nuestro compromiso es brindarles la mejor atención y servicios personalizados.</p>
            <p>Nos enorgullece ser una veterinaria de Bolivia, comprometida con la salud y felicidad de todas las mascotas. Ya sea que tengas perros, gatos u otros animales, contamos con los recursos y conocimientos para ofrecer el mejor servicio.</p>
            <p>Además de consultas veterinarias, ofrecemos un amplio catálogo de productos de alta calidad, incluyendo alimentos, accesorios y medicinas para cubrir todas las necesidades de tus mascotas.</p>
            <p>¿Tienes más de una mascota? Con nuestro sistema, puedes registrar a cada una de ellas y llevar un control detallado de sus consultas, vacunas y tratamientos.</p>
            <p>Somos reconocidos por la calidez y profesionalismo de nuestro equipo. Con más de 10 años de experiencia en el rubro, nos hemos consolidado como la veterinaria más confiable de la región.</p>

            {/* Imagen centrada */}
            <img 
                src="https://img.freepik.com/foto-gratis/veterinaria-feliz-sonriendo-acariciando-hermoso-perro-beagle-mesa-examen-veterinario-profesional-sosteniendo-mascota-mientras-examina-mascota-sana-clinica_662251-2251.jpg" 
                alt="Veterinaria Patito" 
                className="home-image" 
            />
        </div>
    );
};

export default Home;
