const UPDATE_SECTION_LABELS = {
    image: 'Image',
    links: 'Social/contact links',
    profile: 'Profile details',
    layout: 'Card element positions',
    boneValues: 'Gear/kink bone values',
    other: 'Other changes',
};

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function buildCardSubmissionEmailSummary(card) {
    if (card.submissionType !== 'update') {
        return {
            requestLabel: 'New card',
            subjectLabel: 'New Card',
            updateDetailsHtml: '',
        };
    }

    const sections = Array.isArray(card.updateSections) ? card.updateSections : [];
    const sectionItems = sections
        .map((section) => UPDATE_SECTION_LABELS[section])
        .filter(Boolean)
        .map((label) => `<li>${label}</li>`)
        .join('');
    const detail = sections.includes('other') ? String(card.updateDetails ?? '').trim() : '';
    const detailsHtml = detail
        ? `<p style="margin:8px 0 0;"><strong>Additional details:</strong> ${escapeHtml(detail)}</p>`
        : '';
    const consentHtml = card.updateConsent === true
        ? '<p style="margin:8px 0 0;color:#34d399;">Submitter confirmed the listed changes are accurate.</p>'
        : '<p style="margin:8px 0 0;color:#f87171;">Update confirmation not received.</p>';

    return {
        requestLabel: 'Update existing card',
        subjectLabel: 'Card Update',
        updateDetailsHtml: `
          <div style="margin-top:16px;background:#0f172a;padding:16px;border-radius:8px;">
            <p style="margin:0 0 8px;font-weight:bold;">Declared changes</p>
            <ul style="margin:0;padding-left:18px;line-height:1.8;">${sectionItems}</ul>
            ${detailsHtml}
            ${consentHtml}
          </div>`,
    };
}
