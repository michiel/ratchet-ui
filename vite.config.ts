import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
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
