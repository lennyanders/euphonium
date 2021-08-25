import { style } from '@vanilla-extract/css';

export const artistListClass = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
  gap: '1.5rem',
});

export const artistClass = style({
  padding: '0.5rem',
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'space-between',
  gap: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: '#222',
  contain: 'layout paint style',
});

export const artistNameClass = style({
  flex: '0 0 100%',
  paddingLeft: '0.25rem',
  margin: 0,
});

export const badgeClass = style({
  display: 'inline-flex',
  gap: '0.5rem',
  padding: '0.25rem 1rem 0.25rem 0.5rem',
  borderRadius: '1rem',
  color: '#ddd',
  backgroundColor: '#111',
});
