import { style } from '@vanilla-extract/css';

export const nav = style({
  overflowY: 'auto',
  padding: '3rem 6rem 3rem 3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  backgroundColor: ' #111',
});

export const link = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  textDecoration: 'none',
  fontSize: '1.5rem',
  color: 'hsl(0, 0%, 80%)',
  transition: 'color 0.1s ease',
  ':hover': {
    color: 'hsl(0, 0%, 100%)',
  },
});
