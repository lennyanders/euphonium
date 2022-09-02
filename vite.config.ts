import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import rewriteAll from 'vite-plugin-rewrite-all';
import voby from 'voby-vite';

export default defineConfig({
  plugins: [voby(), unocss(), rewriteAll()],
});
