import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import rewriteAll from 'vite-plugin-rewrite-all';
import voby from 'voby-vite';

export default defineConfig({
  plugins: [voby(), unocss(), checker({ typescript: true }), rewriteAll()],
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
