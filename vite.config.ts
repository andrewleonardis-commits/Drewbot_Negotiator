import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/negotiator/',
  build: {
    // This is the output folder INSIDE /negotiator
    outDir: 'dist', 
    // This tells vite where to find the template now
    rollupOptions: {
      input: 'index.template.html'
    },
    // This prevents the 'assets' sub-folder
    assetsDir: '' 
  }
});