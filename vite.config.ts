import { defineConfig } from 'vite';
import unocss from 'unocss/vite';
import voby from 'voby-vite';
import rewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
  plugins: [voby(), unocss(), rewriteAll()],
});
