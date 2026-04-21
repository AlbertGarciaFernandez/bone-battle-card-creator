export function getCoverScale(imageWidth, imageHeight, frameWidth, frameHeight) {
  if (
    !Number.isFinite(imageWidth) ||
    !Number.isFinite(imageHeight) ||
    !Number.isFinite(frameWidth) ||
    !Number.isFinite(frameHeight) ||
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    frameWidth <= 0 ||
    frameHeight <= 0
  ) {
    return 1;
  }

  const containScale = Math.min(frameWidth / imageWidth, frameHeight / imageHeight);
  const coverScale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);

  return coverScale / containScale;
}
