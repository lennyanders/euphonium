import presetIcons from '@unocss/preset-icons';
import { defineConfig } from 'unocss';

export default defineConfig({
  presets: [
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
});
