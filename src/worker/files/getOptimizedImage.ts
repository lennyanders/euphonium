export const getOptimizedImage = async (image: Blob, resolution: number) => {
  const imageBitmap = await createImageBitmap(image);
  const canvas = new OffscreenCanvas(resolution, resolution);

  const context = canvas.getContext('2d')!;
  // @ts-ignore
  context.imageSmoothingQuality = 'high';
  context.drawImage(imageBitmap, 0, 0, resolution, resolution);
  return await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
};
