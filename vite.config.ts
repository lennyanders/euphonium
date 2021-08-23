import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), preact()],
});
