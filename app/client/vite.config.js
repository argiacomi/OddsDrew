import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './components'),
      '@views': path.resolve(__dirname, './views'),
      '@icons': path.resolve(__dirname, './utils/icons'),
      '@utils': path.resolve(__dirname, './utils'),
      '@styles': path.resolve(__dirname, './styles'),
      '@transitions': path.resolve(__dirname, './components/utils/transitions'),
      '@BaseList': path.resolve(__dirname, './components/display/list/baseList')
    }
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-styled-components', 'babel-plugin-macros']
      },
      exclude: /\.stories\.(t|j)sx?$/
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  esbuild: {
    logLevel: 'error'
  }
});
