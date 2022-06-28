import { defineConfig } from 'vite';
import unocss from 'unocss/vite';
import voby from 'voby-vite';

export default defineConfig({
  plugins: [voby(), unocss()],
});
