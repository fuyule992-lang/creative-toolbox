import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'pixel-art': resolve(__dirname, 'tools/pixel-art/index.html'),
        'word-cloud': resolve(__dirname, 'tools/word-cloud/index.html'),
      },
    },
  },
});
