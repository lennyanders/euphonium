export const getOptimizedImage = async (image: Blob) => {
  const imageBitmap = await createImageBitmap(image, { resizeHeight: 1080, resizeWidth: 1080 });
  const canvas = new OffscreenCanvas(1080, 1080);
  const context = canvas.getContext('2d')!;
  context.drawImage(imageBitmap, 0, 0);
  return await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
};
