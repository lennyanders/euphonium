import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import presetFonts from '@unocss/preset-web-fonts';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

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
    presetIcons({
      extraProperties: {
        'background-position': 'center',
        'background-size': 'contain',
        'aspect-ratio': '1',
        height: 'auto',
      },
      customizations: {
        iconCustomizer(collection, icon, props) {
          if (collection === 'mdi' && icon === 'disk') props.color = '#fecc3d';
        },
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
  rules: [
    [
      /^p-(\d+)-(\d+)-(\d+)-(\d+)$/,
      ([_, t, r, b, l]) => ({ padding: `${+t / 4}rem ${+r / 4}rem ${+b / 4}rem ${+l / 4}rem` }),
    ],
    [/^p-(\d+)-(\d+)$/, ([_, y, x]) => ({ padding: `${+y / 4}rem ${+x / 4}rem` })],
    [/^background-size-(.*)$/, ([, d]) => ({ 'background-size': d })],
    [/^var-(.*)-(.*)$/, ([, name, val]) => ({ [`--${name}`]: val })],
    [/^shadow-\[(.*)\]$/, ([, val]) => ({ 'box-shadow': val.replace(/_/g, ' ') })],
    [/^bgi-\[(.*)\]$/, ([, val]) => ({ 'background-image': val.replace(/_/g, ' ') })],
  ],
});
