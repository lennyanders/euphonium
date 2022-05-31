import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetFonts from '@unocss/preset-web-fonts';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetUno(),
    presetFonts({
      provider: 'none',
      fonts: {
        sans: 'Lato',
        lato: [{ name: 'Lato', weights: [100, 300, 400, 700, 900], italic: true }],
      },
    }),
    presetIcons(),
  ],
  rules: [
    [/^mask-size-(.*)$/, ([, d]) => ({ 'mask-size': d, '-webkit-mask-size': d })],
    [/^mask-position-(.*)$/, ([, d]) => ({ 'mask-position': d, '-webkit-mask-position': d })],
  ],
});
