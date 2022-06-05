import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetFonts from '@unocss/preset-web-fonts';
import presetIcons from '@unocss/preset-icons';
import transformerVariantGroup from '@unocss/transformer-variant-group';

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
  transformers: [transformerVariantGroup()],
  rules: [
    [/^mask-size-(.*)$/, ([, d]) => ({ 'mask-size': d, '-webkit-mask-size': d })],
    [/^mask-position-(.*)$/, ([, d]) => ({ 'mask-position': d, '-webkit-mask-position': d })],
    [/^var-(.*)-(.*)$/, ([, name, val]) => ({ [`--${name}`]: val })],
    [/^shadow-\[(.*)\]$/, ([, val]) => ({ 'box-shadow': val.replace(/_/g, ' ') })],
    [/^bgi-\[(.*)\]$/, ([, val]) => ({ 'background-image': val.replace(/_/g, ' ') })],
  ],
});
