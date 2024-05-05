import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import voby from 'voby-vite';

export default defineConfig({
  plugins: [
    unocss(),
    voby({ hmr: { enabled: process.env.NODE_ENV !== 'production', filter: /\.(jsx|tsx)$/ } }),
    checker({ typescript: true }),
  ],
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
