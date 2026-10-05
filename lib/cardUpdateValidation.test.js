import test from 'node:test';
import assert from 'node:assert/strict';
import { isCardUpdateValid } from './cardUpdateValidation.js';

const baseUpdate = {
    submissionType: 'update',
    name: 'Rex',
    socialLink: '@rex',
    updateSections: ['image'],
    updateConsent: true,
    imageUrl: 'https://example.com/new-image.jpg',
    termsConsent: true,
    decisionConsent: true,
};

test('allows an image-only update without requiring existing profile or bone values', () => {
    assert.equal(isCardUpdateValid(baseUpdate), true);
    assert.equal(isCardUpdateValid({ ...baseUpdate, socialLink: '' }), false);
});

test('server-side image updates require an actual uploaded image, not a claimed URL', () => {
    assert.equal(isCardUpdateValid(baseUpdate, { imageAttachmentRequired: true }), false);
    assert.equal(isCardUpdateValid(baseUpdate, { imageAttachmentRequired: true, imageAttached: true }), true);
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['links'] }, { imageAttachmentRequired: true }), true);
});

test('requires bone values to be valid only when that update area is selected', () => {
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['boneValues'], totalBones: 0 }), false);
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['boneValues'], totalBones: 55 }), true);
});

test('requires fields from every selected update area', () => {
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['links'], socialLink: '' }), false);
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['links'], socialLink: '@rex' }), true);
});

test('requires profile fields only when Profile is selected', () => {
    const profile = {
        ...baseUpdate,
        updateSections: ['profile'],
        hoodColor: 'Red',
        height: '1.78',
        shoeSize: '42',
        birthdate: '2020.05',
        country: 'DE',
    };

    assert.equal(isCardUpdateValid(profile), true);
    assert.equal(isCardUpdateValid({ ...profile, country: '' }), false);
});

test('requires layout values only when Card element positions are selected', () => {
    assert.equal(isCardUpdateValid({
        ...baseUpdate,
        updateSections: ['layout'],
        namePosition: 'left-top',
        statsPosition: 'right-middle',
    }), true);
    assert.equal(isCardUpdateValid({ ...baseUpdate, updateSections: ['layout'], namePosition: '' }), false);
});
