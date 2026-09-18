export const prepareOriginalImageBlob = async ({ imageUrl, uploadedImageFile, compressImageUrl }) => {
  if (uploadedImageFile) return uploadedImageFile;
  if (!imageUrl) return null;

  return compressImageUrl(imageUrl, 2000, 0.9);
};
