import test from 'node:test';
import assert from 'node:assert/strict';
import { isCardUpdateValid } from './cardUpdateValidation.js';

const validUpdate = {
    submissionType: 'update', serialNumber: 'BB-12345', name: 'Rex',
    socialLink: '@rex', imageUrl: 'https://example.com/photo.jpg',
    hoodColor: 'Red', height: '1.78m', shoeSize: '42', birthdate: '2020.05', country: 'DE',
    namePosition: 'left-top', statsPosition: 'right-bottom', totalBones: 55,
    termsConsent: true, decisionConsent: true,
};

test('accepts a complete update without any list of changed fields', () => {
    assert.equal(isCardUpdateValid(validUpdate), true);
});

test('requires the existing card number and complete new-card data', () => {
    assert.equal(isCardUpdateValid({ ...validUpdate, serialNumber: ' ' }), false);
    assert.equal(isCardUpdateValid({ ...validUpdate, serialNumber: 'X'.repeat(81) }), false);
    assert.equal(isCardUpdateValid({ ...validUpdate, height: '' }), false);
    assert.equal(isCardUpdateValid({ ...validUpdate, imageUrl: '' }), false);
    assert.equal(isCardUpdateValid({ ...validUpdate, birthdate: 'invalid' }), false);
    assert.equal(isCardUpdateValid({ ...validUpdate, totalBones: 71 }), false);
});

test('server-side updates require the image attachment used to regenerate the card', () => {
    assert.equal(isCardUpdateValid(validUpdate, { imageAttachmentRequired: true }), false);
    assert.equal(isCardUpdateValid(validUpdate, { imageAttachmentRequired: true, imageAttached: true }), true);
});

test('does not impose update-only requirements on a new-card submission', () => {
    assert.equal(isCardUpdateValid({ submissionType: 'new' }), true);
});
