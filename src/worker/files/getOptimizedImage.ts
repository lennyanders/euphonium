export const getOptimizedImages = async (image: Blob): Promise<DbImages> => {
  const sizes = { small: 96, medium: 320, large: 1080 };
  return Object.fromEntries(
    await Promise.all(
      Object.entries(sizes).map(async ([name, size]) => [
        name,
        await getOptimizedImage(image, size),
      ]),
    ),
  );
};

const getOptimizedImage = async (image: Blob, resolution: number) => {
  const imageBitmap = await createImageBitmap(image);
  const canvas = new OffscreenCanvas(resolution, resolution);

  const context = canvas.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  context.drawImage(imageBitmap, 0, 0, resolution, resolution);
  return await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
};
