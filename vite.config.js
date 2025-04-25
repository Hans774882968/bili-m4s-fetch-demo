import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { playInfoMockPlugin } from './src/vite-custom-plugins/playInfoMockPlugin';

const destName = 'dist';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const inputOption = isDev ? path.resolve(__dirname, 'index.html') : {
    content: path.resolve(__dirname, 'src/content.js')
  };

  return {
    plugins: [
      react(),
      copy({
        targets: [
          { src: 'src/images', dest: destName },
          { src: 'background.js', dest: destName },
          { src: 'manifest.json', dest: destName },
        ],
        hook: 'writeBundle',
      }),
      nodePolyfills({
        include: ['process'],
      }),
      playInfoMockPlugin()
    ],
    build: {
      rollupOptions: {
        input: inputOption,
        output: {
          entryFileNames: '[name].js',
          assetFileNames: '[name].[ext]' // CSS
        }
      }
    }
  };
});
