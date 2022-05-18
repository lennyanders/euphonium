import { style } from '@vanilla-extract/css';

export const basicTrackInfoClass = style({ lineHeight: '1.5rem' });

export const coverClass = style({
  float: 'left',
  height: '3rem',
  width: '3rem',
  marginRight: '0.5rem',
  borderRadius: '0.5rem',
  backgroundImage: `url('/src/images/album.svg')`,
  backgroundSize: 'contain',
  backgroundColor: '#222',
});

export const artistClass = style({
  display: 'block',
  color: '#aaa',
});
