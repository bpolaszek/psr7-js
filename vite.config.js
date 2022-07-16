import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'psr7-js',
      fileName: 'psr7-js',
    },
    rollupOptions: {
      external: [
        'deepmerge',
      ],
    },
  },
});

