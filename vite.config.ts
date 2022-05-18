import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import preact from '@preact/preset-vite';
import checker from 'vite-plugin-checker';
import voby from 'voby-vite';

export default defineConfig({
  plugins: [voby(), checker({ typescript: true })],
});
