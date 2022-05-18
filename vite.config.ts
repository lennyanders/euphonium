import { defineConfig } from 'vite';
import unocss from 'unocss/vite';
import voby from 'voby-vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [voby(), unocss(), checker({ typescript: true })],
});
