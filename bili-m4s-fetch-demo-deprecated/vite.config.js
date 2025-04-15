import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';

const destName = 'dist';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'src/images', dest: destName },
        { src: 'background.js', dest: destName },
        { src: 'content.js', dest: destName },
        { src: 'manifest.json', dest: destName },
      ],
      hook: 'writeBundle',
    }),
  ],
});
