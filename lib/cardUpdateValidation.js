const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export function isCardUpdateValid(card, options = {}) {
    if (card?.submissionType !== 'update') return true;

    const fields = [card.name, card.socialLink, card.imageUrl, card.hoodColor, card.height, card.shoeSize, card.country, card.namePosition, card.statsPosition];
    if (fields.some((field) => !hasText(field)) || !hasText(card.serialNumber) || card.serialNumber.trim().length > 80) return false;
    if (!/^\d{4}\.\d{2}$/.test(card.birthdate ?? '')) return false;
    if (card.termsConsent !== true || card.decisionConsent !== true) return false;
    if (options.imageAttachmentRequired && !options.imageAttached) return false;

    const totalBones = Number(card.totalBones);
    const tricksNeeded = Math.ceil(Math.max(0, 50 - totalBones) / 4);
    const tricksBalanceShortfall = totalBones < 50 && card.dogTricksPermission === true &&
        Array.isArray(card.dogTricks) && card.dogTricks.length >= tricksNeeded;
    return Number.isFinite(totalBones) && totalBones <= 70 && (totalBones >= 50 || tricksBalanceShortfall);
}
