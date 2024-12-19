import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Asegúrate de que la carpeta de salida sea "build"
    chunkSizeWarningLimit: 1000, // Aumenta el límite para evitar la advertencia de chunks grandes
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Divide las dependencias principales en un chunk separado
        },
      },
    },
  },
  base: '/PRODUCCION-VETERINARIA-PATITO-/', // Reemplaza <nombre-del-repo> con el nombre de tu repositorio de GitHub
})
