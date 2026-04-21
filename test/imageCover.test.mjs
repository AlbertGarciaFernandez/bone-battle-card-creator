import assert from 'node:assert/strict';
import test from 'node:test';

import { getCoverScale } from '../lib/imageCover.js';

test('returns 1 when image already matches the frame ratio', () => {
  assert.equal(getCoverScale(1500, 1400, 15, 14), 1);
});

test('scales up landscape images so the frame is fully covered', () => {
  const scale = getCoverScale(1920, 1080, 15, 14);

  assert.ok(scale > 1, 'expected landscape image to scale up');
  assert.equal(scale, 1.6592592592592592);
});

test('scales up portrait images only as much as needed', () => {
  const scale = getCoverScale(1080, 1350, 15, 14);

  assert.ok(scale > 1, 'expected portrait image to scale up');
  assert.ok(Math.abs(scale - 1.3392857142857144) < 1e-12);
});
