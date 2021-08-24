import { style, globalStyle } from '@vanilla-extract/css';

export const progressClass = style({
  vars: {
    '--thickness': '0.5rem',
    '--half-thickness': 'calc(var(--thickness) / 2)',
  },
  position: 'relative',
  height: 'var(--thickness)',
  borderRadius: 'var(--half-thickness)',
  color: '#2962ff',
  backgroundColor: '#333',
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    height: 'var(--thickness)',
    width: 'var(--thickness)',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    left: 'var(--half-thickness)',
    right: 'var(--half-thickness)',
    height: '100%',
    backgroundColor: 'currentColor',
    transformOrigin: 'left',
    transform: 'scaleX(var(--progress))',
  },
});

export const progressHandleClass = style({
  position: 'absolute',
  left: 'var(--thickness)',
  right: 0,
  height: '100%',
  transform: 'translateX(calc(-100% + var(--progress)))',
  pointerEvents: 'none',
  '::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    height: 'var(--thickness)',
    width: 'var(--thickness)',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    transition: 'transform 0.2s ease',
  },
  selectors: {
    [`${progressClass}:hover &::after`]: {
      transform: 'scale(1.5)',
    },
  },
});

export const progressInputClass = style({
  position: 'absolute',
  height: '100%',
  width: '100%',
  left: 0,
  padding: '0 var(--half-thickness)',
  margin: 0,
  opacity: 0,
  zIndex: 1,
});
