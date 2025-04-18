import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  esbuild: {
    target: 'esnext',
    logOverride: {
      'unsupported-dynamic-import': 'silent',
    },
    // Support CommonJS modules
    format: 'esm',
    mainFields: ['module', 'main'],
  },
  resolve: {
    alias: {
      'firebase/app': 'firebase/app',
      'firebase/auth': 'firebase/auth',
      'firebase/firestore': 'firebase/firestore',
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', './src/firebase.js'],
  },
});
