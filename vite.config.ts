import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
    'global': 'globalThis',
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './src/index.tsx',
      name: 'RatchetUI',
      formats: ['iife'],
      fileName: () => 'script.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return '[name].[ext]';
        },
        dir: 'dist/assets'
      }
    }
  }
});
