import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCardSubmissionEmailSummary } from './cardSubmissionEmail.js';

test('labels new-card submissions without update details', () => {
    assert.deepEqual(buildCardSubmissionEmailSummary({ submissionType: 'new' }), {
        requestLabel: 'New card',
        subjectLabel: 'New Card',
        updateDetailsHtml: '',
    });
});

test('includes selected update areas and safely escaped detail', () => {
    const summary = buildCardSubmissionEmailSummary({
        submissionType: 'update',
        updateSections: ['image', 'links', 'boneValues', 'other'],
        updateDetails: 'Changed image <and> @new-link',
        updateConsent: true,
    });

    assert.equal(summary.requestLabel, 'Update existing card');
    assert.equal(summary.subjectLabel, 'Card Update');
    assert.match(summary.updateDetailsHtml, /Image/);
    assert.match(summary.updateDetailsHtml, /Social\/contact links/);
    assert.match(summary.updateDetailsHtml, /Gear\/kink bone values/);
    assert.match(summary.updateDetailsHtml, /Changed image &lt;and&gt; @new-link/);
    assert.match(summary.updateDetailsHtml, /confirmed the listed changes/);
});

test('omits stale additional details when Other changes is not selected', () => {
    const summary = buildCardSubmissionEmailSummary({
        submissionType: 'update',
        updateSections: ['image'],
        updateDetails: 'Old unselected update note',
        updateConsent: true,
    });

    assert.doesNotMatch(summary.updateDetailsHtml, /Old unselected update note/);
});
