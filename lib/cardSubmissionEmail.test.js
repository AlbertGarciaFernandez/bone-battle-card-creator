import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCardSubmissionEmailSummary } from './cardSubmissionEmail.js';

test('distinguishes new and existing-card email headings without partial change lists', () => {
    assert.deepEqual(buildCardSubmissionEmailSummary({ submissionType: 'new' }), {
        requestLabel: 'New card', subjectLabel: 'New Card',
    });
    assert.deepEqual(buildCardSubmissionEmailSummary({ submissionType: 'update' }), {
        requestLabel: 'Update existing card', subjectLabel: 'Card Update',
    });
});
