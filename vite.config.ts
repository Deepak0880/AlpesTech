// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@' points to 'src'
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // optional, default Vite port
    proxy: {
      '/api': 'https://alpestech-backend.onrender.com', // frontend API proxy
    },
  },
});
