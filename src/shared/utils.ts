const pad = (number: number) => number.toString().padStart(2, '0');

export const getFormattedTime = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours ? `${hours}:` : ''}${hours ? pad(minutes) : minutes}:${pad(seconds)}`;
};

export const wait = async (time: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
};
