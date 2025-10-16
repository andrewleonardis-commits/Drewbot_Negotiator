// D:/thedoplife/negotiator/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/negotiator/', // This is correct and needed.
  plugins: [react()],
  // I have removed the problematic 'build', 'define', and 'resolve' sections
  // for clarity. You can add the 'define' and 'resolve' back if you
  // absolutely need them, but the 'build' section MUST be removed.
});