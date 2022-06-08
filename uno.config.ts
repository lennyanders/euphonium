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
    [/^background-size-(.*)$/, ([, d]) => ({ 'background-size': d })],
    [/^var-(.*)-(.*)$/, ([, name, val]) => ({ [`--${name}`]: val })],
    [/^shadow-\[(.*)\]$/, ([, val]) => ({ 'box-shadow': val.replace(/_/g, ' ') })],
    [/^bgi-\[(.*)\]$/, ([, val]) => ({ 'background-image': val.replace(/_/g, ' ') })],
  ],
});
