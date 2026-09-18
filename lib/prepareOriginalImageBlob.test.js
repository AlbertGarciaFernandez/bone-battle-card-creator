import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareOriginalImageBlob } from './prepareOriginalImageBlob.js';

test('uses the uploaded image file without recompressing it', async () => {
  const uploadedFile = new File(['original image bytes'], 'pup.png', { type: 'image/png' });
  let compressorCalled = false;

  const result = await prepareOriginalImageBlob({
    imageUrl: 'blob:https://example.com/preview',
    uploadedImageFile: uploadedFile,
    compressImageUrl: async () => {
      compressorCalled = true;
      return new Blob(['compressed'], { type: 'image/jpeg' });
    },
  });

  assert.equal(result, uploadedFile);
  assert.equal(compressorCalled, false);
});

test('falls back to compressing image URLs when no uploaded file exists', async () => {
  const compressed = new Blob(['compressed'], { type: 'image/jpeg' });

  const result = await prepareOriginalImageBlob({
    imageUrl: 'https://example.com/pup.jpg',
    uploadedImageFile: null,
    compressImageUrl: async (imageUrl, maxWidth, quality) => {
      assert.equal(imageUrl, 'https://example.com/pup.jpg');
      assert.equal(maxWidth, 2000);
      assert.equal(quality, 0.9);
      return compressed;
    },
  });

  assert.equal(result, compressed);
});
