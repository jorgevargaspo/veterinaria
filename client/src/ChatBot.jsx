import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
  background: 'linear-gradient(to bottom, #ffffff, #f0f8ff)',
  fontFamily: 'Arial, sans-serif',
  headerBgColor: '#007bff',
  headerFontColor: '#fff',
  headerFontSize: '18px',
  botBubbleColor: '#007bff',
  botFontColor: '#fff',
  userBubbleColor: '#f1f1f1',
  userFontColor: '#4a4a4a',
  borderRadius: '8px',
};

const getGreeting = (name) => {
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? '¡Buenos días'
    : hour < 18
    ? '¡Buenas tardes'
    : '¡Buenas noches';
  return `${greeting}, ${name}! Soy tu asistente virtual. 😊 ¿Cómo puedo ayudarte hoy?`;
};

const steps = [
  {
    id: '1',
    message: '¡Hola! ¿Cuál es tu nombre?',
    trigger: 'getName',
  },
  {
    id: 'getName',
    user: true,
    validator: (value) => {
      if (value.trim().length === 0) {
        return 'Por favor, escribe tu nombre.';
      }
      return true;
    },
    trigger: '2',
  },
  {
    id: '2',
    message: ({ previousValue }) => getGreeting(previousValue),
    trigger: 'menu',
  },
  {
    id: 'menu',
    options: [
      { value: 'citas', label: 'Información sobre citas', trigger: 'citas' },
      { value: 'productos', label: 'Información sobre productos', trigger: 'productos' },
      { value: 'servicios', label: 'Nuestros servicios', trigger: 'servicios' },
      { value: 'contacto', label: 'Contacto', trigger: 'contacto' },
      { value: 'otros', label: 'Otros temas', trigger: 'otros' },
    ],
  },
  {
    id: 'citas',
    component: (
      <div>
        <p>
          Haz clic en este{' '}
          <a
            href="/citas"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            enlace
          </a>{' '}
          para agendar tu cita. ¡Estaremos felices de atenderte!
        </p>
      </div>
    ),
    trigger: 'backToMenu',
  },
  {
    id: 'productos',
    component: (
      <div>
        <p>Aquí tienes una muestra de nuestros productos destacados:</p>
        <img
          src="https://via.placeholder.com/300x200"
          alt="Nuestros productos destacados"
          style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '10px' }}
        />
        <p>
          Visita nuestra{' '}
          <a
            href="/productos"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            sección de productos
          </a>{' '}
          para más detalles.
        </p>
      </div>
    ),
    trigger: 'backToMenu',
  },
  {
    id: 'servicios',
    component: (
      <div>
        <p>
          Ofrecemos servicios como:
          <ul>
            <li>Consultas veterinarias</li>
            <li>Vacunación</li>
            <li>Cirugía menor</li>
            <li>Grooming</li>
          </ul>
          Consulta nuestra{' '}
          <a
            href="/servicios"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            lista completa de servicios
          </a>{' '}
          para más información.
        </p>
      </div>
    ),
    trigger: 'backToMenu',
  },
  {
    id: 'contacto',
    message: 'Puedes contactarnos al teléfono 123-456-7890 o por correo a contacto@veterinariapatito.com.',
    trigger: 'backToMenu',
  },
  {
    id: 'otros',
    options: [
      { value: 'sugerencias', label: 'Enviar una sugerencia', trigger: 'sugerencias' },
      { value: 'feedback', label: 'Dar retroalimentación', trigger: 'feedback' },
      { value: 'volver', label: 'Volver al menú principal', trigger: 'menu' },
    ],
  },
  {
    id: 'sugerencias',
    message: 'Por favor, envíanos tus sugerencias a contacto@veterinariapatito.com. ¿Algo más?',
    trigger: 'backToMenu',
  },
  {
    id: 'feedback',
    message: '¿Cómo calificarías tu experiencia con nosotros?',
    trigger: 'calificacion',
  },
  {
    id: 'calificacion',
    options: [
      { value: 'excelente', label: 'Excelente', trigger: 'agradecimiento' },
      { value: 'buena', label: 'Buena', trigger: 'agradecimiento' },
      { value: 'regular', label: 'Regular', trigger: 'agradecimiento' },
      { value: 'mala', label: 'Mala', trigger: 'agradecimiento' },
    ],
  },
  {
    id: 'agradecimiento',
    message: '¡Gracias por tu opinión! Nos esforzaremos por mejorar continuamente. 😊',
    trigger: 'backToMenu',
  },
  {
    id: 'backToMenu',
    options: [
      { value: 'si', label: 'Sí, quiero volver al menú', trigger: 'menu' },
      { value: 'no', label: 'No, eso es todo', trigger: 'end' },
    ],
  },
  {
    id: 'end',
    message: '¡Gracias por visitarnos! Que tengas un excelente día. 😊',
    end: true,
  },
];

function CustomChatBot() {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        steps={steps}
        botAvatar="https://via.placeholder.com/100x100"
        userAvatar="https://via.placeholder.com/80x80"
      />
    </ThemeProvider>
  );
}

export default CustomChatBot;
