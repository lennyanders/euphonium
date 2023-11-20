const remInPx = parseInt(getComputedStyle(document.documentElement).fontSize);

export const remToPx = (rem: number) => rem * remInPx;
