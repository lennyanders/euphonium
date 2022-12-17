import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import rewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
  plugins: [unocss(), checker({ typescript: true }), rewriteAll()],
  esbuild: {
    jsxInject: `import { h as $$h, Fragment as $$F } from 'voby';\n`,
    jsxFactory: '$$h',
    jsxFragment: '$$F',
  },
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
