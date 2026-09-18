export const UPLOAD_IMAGE_LIMIT_BYTES = 20 * 1024 * 1024;
export const OPTIMIZED_IMAGE_TARGET_BYTES = 3.2 * 1024 * 1024;
export const OPTIMIZED_IMAGE_MAX_DIMENSION = 3600;

const OPTIMIZATION_ATTEMPTS = [
  { maxDimension: OPTIMIZED_IMAGE_MAX_DIMENSION, quality: 0.95 },
  { maxDimension: 3200, quality: 0.94 },
  { maxDimension: 3000, quality: 0.93 },
  { maxDimension: 2800, quality: 0.92 },
  { maxDimension: 2600, quality: 0.91 },
  { maxDimension: 2400, quality: 0.9 },
  { maxDimension: 2200, quality: 0.88 },
  { maxDimension: 2000, quality: 0.86 },
];

const optimizedFilename = (name) => {
  const base = String(name || 'pup_image').replace(/\.[^.]+$/, '') || 'pup_image';
  return `${base}_optimized.jpg`;
};

const getBitmap = async (file) => {
  if (typeof createImageBitmap === 'function') return createImageBitmap(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
};

const browserDeps = {
  renderImage: async (file, { maxDimension, quality }) => {
    const source = await getBitmap(file);
    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context failed');
    ctx.drawImage(source, 0, 0, width, height);
    if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) source.close();

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Image optimization failed'))),
        'image/jpeg',
        quality,
      );
    });
  },
};

export const optimizeUploadedImage = async (file, deps = browserDeps) => {
  if (!file) return null;
  if (!file.type?.startsWith('image/')) throw new Error('Please upload an image file.');
  if (file.size > UPLOAD_IMAGE_LIMIT_BYTES) {
    throw new Error('Image is too large. Please upload an image under 20MB.');
  }

  if (file.size <= OPTIMIZED_IMAGE_TARGET_BYTES) {
    return {
      blob: file,
      filename: file.name || 'pup_image.jpg',
      optimized: false,
      originalBytes: file.size,
      optimizedBytes: file.size,
    };
  }

  let bestBlob = null;
  for (const attempt of OPTIMIZATION_ATTEMPTS) {
    const blob = await deps.renderImage(file, attempt);
    if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;
    if (blob.size <= OPTIMIZED_IMAGE_TARGET_BYTES) {
      return {
        blob,
        filename: optimizedFilename(file.name),
        optimized: true,
        originalBytes: file.size,
        optimizedBytes: blob.size,
        maxDimension: attempt.maxDimension,
        quality: attempt.quality,
      };
    }
  }

  throw new Error('This image is too large to send safely. Please try another photo or send the original by DM after submitting.');
};
