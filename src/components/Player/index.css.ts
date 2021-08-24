import { style } from '@vanilla-extract/css';

export const playerClass = style({
  gridColumnStart: 1,
  gridColumnEnd: 3,
  padding: '0.5rem',
  display: 'grid',
  gap: '0.5rem',
  backgroundColor: '#111',
});

export const progressClass = style({
  display: 'grid',
  gridTemplateColumns: '5ch 1fr 5ch',
  gap: '0.5rem',
  alignItems: 'center',
  textAlign: 'center',
});

export const playerBottomClass = style({
  padding: '0 0.5rem',
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
});

export const controlsClass = style({
  display: 'flex',
  gap: '1rem',
});

export const otherOptionsClass = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',
});

export const volumeClass = style({ width: '7.5rem' });

export const mutedClass = style({
  position: 'relative',
  '::before': {
    content: '""',
    position: 'absolute',
    height: '0.125rem',
    width: '1.5rem',
    top: '50%',
    left: ' 50%',
    backgroundColor: 'currentColor',
    boxShadow: '0 -0.125rem 0 0 #111',
    transform: 'translate(-50%, -50%) rotate(45deg)',
  },
});
