import { globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('body', {
  margin: 0,
  height: '100vh',
  backgroundColor: '#222',
  fontFamily: 'Arial, Helvetica, sans-serif',
  lineHeight: 1.5,
  // display: 'grid',
  // gridTemplate: '"nav content" 1fr "player player" auto / auto 1fr',
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
