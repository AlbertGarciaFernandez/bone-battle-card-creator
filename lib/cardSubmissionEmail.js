export function buildCardSubmissionEmailSummary(card) {
    return card.submissionType === 'update'
        ? { requestLabel: 'Update existing card', subjectLabel: 'Card Update' }
        : { requestLabel: 'New card', subjectLabel: 'New Card' };
}
