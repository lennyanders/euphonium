import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  rules: [
    [/^mask-size-(.*)$/, ([, d]) => ({ 'mask-size': d, '-webkit-mask-size': d })],
    [/^mask-position-(.*)$/, ([, d]) => ({ 'mask-position': d, '-webkit-mask-position': d })],
  ],
});
