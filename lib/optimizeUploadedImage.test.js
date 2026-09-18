import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OPTIMIZED_IMAGE_MAX_DIMENSION,
  OPTIMIZED_IMAGE_TARGET_BYTES,
  UPLOAD_IMAGE_LIMIT_BYTES,
  optimizeUploadedImage,
} from './optimizeUploadedImage.js';

const makeDeps = ({ width = 4000, height = 3000, sizes }) => {
  const attempts = [];
  return {
    attempts,
    deps: {
      getImageSize: async () => ({ width, height }),
      renderImage: async (_file, options) => {
        attempts.push(options);
        const size = sizes[Math.min(attempts.length - 1, sizes.length - 1)];
        return new Blob([new Uint8Array(size)], { type: 'image/jpeg' });
      },
    },
  };
};

test('rejects uploaded images over 20MB before processing', async () => {
  const file = new File([new Uint8Array(UPLOAD_IMAGE_LIMIT_BYTES + 1)], 'huge.jpg', { type: 'image/jpeg' });
  const { deps, attempts } = makeDeps({ sizes: [1024] });

  await assert.rejects(
    optimizeUploadedImage(file, deps),
    /20MB/,
  );
  assert.equal(attempts.length, 0);
});

test('keeps uploaded images under target without recompressing', async () => {
  const file = new File([new Uint8Array(1024 * 1024)], 'pup.png', { type: 'image/png' });
  const { deps, attempts } = makeDeps({ sizes: [1024] });

  const result = await optimizeUploadedImage(file, deps);

  assert.equal(result.blob, file);
  assert.equal(result.filename, 'pup.png');
  assert.equal(result.optimized, false);
  assert.equal(attempts.length, 0);
});

test('compresses heavy uploads with high quality and bounded dimensions', async () => {
  const file = new File([new Uint8Array(8 * 1024 * 1024)], 'pup.png', { type: 'image/png' });
  const { deps, attempts } = makeDeps({
    width: 4000,
    height: 3000,
    sizes: [4 * 1024 * 1024, 2 * 1024 * 1024],
  });

  const result = await optimizeUploadedImage(file, deps);

  assert.equal(result.optimized, true);
  assert.equal(result.filename, 'pup_optimized.jpg');
  assert.equal(result.blob.type, 'image/jpeg');
  assert.ok(result.blob.size <= OPTIMIZED_IMAGE_TARGET_BYTES);
  assert.deepEqual(attempts[0], { maxDimension: OPTIMIZED_IMAGE_MAX_DIMENSION, quality: 0.95 });
  assert.deepEqual(attempts[1], { maxDimension: 3200, quality: 0.94 });
});

test('fails clearly when a heavy upload cannot reach the target size', async () => {
  const file = new File([new Uint8Array(8 * 1024 * 1024)], 'pup.jpg', { type: 'image/jpeg' });
  const { deps } = makeDeps({ sizes: [4 * 1024 * 1024] });

  await assert.rejects(
    optimizeUploadedImage(file, deps),
    /too large to send safely/,
  );
});
