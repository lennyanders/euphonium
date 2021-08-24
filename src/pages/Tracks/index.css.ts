import { style } from '@vanilla-extract/css';

export const trackClass = style({
  height: '3rem',
  contain: 'layout paint size style',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const artistClass = style({
  color: '#aaa',
});
