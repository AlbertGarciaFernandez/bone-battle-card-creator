const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export function isCardUpdateValid(card, options = {}) {
    if (card?.submissionType !== 'update') return true;

    const sections = new Set(Array.isArray(card.updateSections) ? card.updateSections : []);
    if (!hasText(card.name) || !hasText(card.socialLink) || sections.size === 0 || card.updateConsent !== true) return false;
    if (card.termsConsent !== true || card.decisionConsent !== true) return false;

    if (sections.has('image') && (!hasText(card.imageUrl) || (options.imageAttachmentRequired && !options.imageAttached))) return false;
    if (sections.has('layout') && (!hasText(card.namePosition) || !hasText(card.statsPosition))) return false;

    if (sections.has('profile')) {
        if (
            !hasText(card.hoodColor) ||
            !hasText(card.height) ||
            !hasText(card.shoeSize) ||
            !/^\d{4}\.\d{2}$/.test(card.birthdate ?? '') ||
            !hasText(card.country)
        ) return false;
    }

    if (sections.has('boneValues')) {
        const totalBones = Number(card.totalBones);
        const tricksNeeded = Math.ceil(Math.max(0, 50 - totalBones) / 4);
        const tricksBalanceShortfall = totalBones < 50 && card.dogTricksPermission === true &&
            Array.isArray(card.dogTricks) && card.dogTricks.length >= tricksNeeded;
        if (!Number.isFinite(totalBones) || totalBones > 70 || (totalBones < 50 && !tricksBalanceShortfall)) return false;
    }

    return true;
}
