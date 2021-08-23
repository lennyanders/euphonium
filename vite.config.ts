import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import preact from '@preact/preset-vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), preact(), checker({ typescript: true })],
});
