import vue from '@vitejs/plugin-vue';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import rewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
  plugins: [vue(), unocss(), rewriteAll()],
  define: {
    'global.Uint8Array': 'Uint8Array',
    'process.env.NODE_DEBUG': false,
  },
  resolve: {
    alias: {
      'node:buffer': 'buffer',
    },
  },
});
