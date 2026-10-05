import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCardSubmissionSchema } from './cardSubmissionSchema.js';

const card = {
    submissionType: 'new', serialNumber: '', name: 'Rex', hoodColor: 'Red',
    birthdate: '2020.05', height: '1.78m', shoeSize: '42', socialLink: '@rex', country: 'DE',
    gear: { Rubber: 5 }, kinks: { Toys: 2 },
    isCollectable: false, isOnlinePlayable: true, isAllowTrades: false,
};
const shoeSizeRows = [{ eu: '42', us: '9.5' }];

test('new and update submissions share the complete creator JSON with only update metadata differing', () => {
    const newCard = buildCardSubmissionSchema(card, shoeSizeRows);
    const update = buildCardSubmissionSchema({ ...card, submissionType: 'update', serialNumber: ' BB-12345 ' }, shoeSizeRows);

    assert.equal(newCard.action, 'new');
    assert.equal(Object.hasOwn(newCard, 'oldCardNumber'), false);
    assert.deepEqual(update, { ...newCard, action: 'update', oldCardNumber: 'BB-12345' });
    assert.equal(update.shoe_size, '42EU / 9.5US');
    assert.equal(update.gear.rubber, 5);
    assert.equal(update.kinks.toys, 2);
    assert.equal(update.is_online_playable, true);
    assert.equal(update.gear_tricks.rubber, null);
});
