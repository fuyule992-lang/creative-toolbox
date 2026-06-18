import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
