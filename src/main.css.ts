import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('button', {
  cursor: 'pointer',
});

globalStyle('body', {
  margin: 0,
  height: '100vh',
  backgroundColor: '#222',
  fontFamily: 'Arial, Helvetica, sans-serif',
  lineHeight: 1.5,
  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: 'auto 1fr',
});

globalStyle('ul:where([class])', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

globalStyle('img', {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
});

export const main = style({
  overflowY: 'auto',
  padding: '1.25rem 3rem',
  '::-webkit-scrollbar': {
    width: '0.75rem',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#333',
  },
});
