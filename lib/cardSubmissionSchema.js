const gearMap = {
    'Rubber': 'rubber', 'Leather': 'leather', 'Sox/Sneaker': 'skate',
    'Jocks/Undies': 'underwear', 'Furry': 'suit', 'MX/Biker': 'mx',
    'Sportswear': 'sports', 'Tactical/Unif.': 'tactical',
};
const kinkMap = {
    'Outdoor/Dares': 'outdoor', 'Sniffing': 'sniffing', 'Edging': 'edging',
    'Fisting': 'fisting', 'ABDL': 'abdl', 'Toys': 'toys',
    'Cuckolding': 'cuckolding', 'Power Play': 'powerplay', 'Chastity': 'chastity',
    'BDSM': 'bdsm', 'Verbal': 'verbal', 'Dirty': 'dirty',
};

export function buildCardSubmissionSchema(card, shoeSizeRows) {
    const gear = Object.fromEntries(Object.entries(gearMap).map(([label, key]) => [key, card.gear[label] ?? 0]));
    const kinks = Object.fromEntries(Object.entries(kinkMap).map(([label, key]) => [key, card.kinks[label] ?? 0]));
    const sizeRow = shoeSizeRows.find((size) => size.eu === card.shoeSize);
    const isInstagram = (card.socialPlatform || 'instagram') === 'instagram';

    return {
        action: card.submissionType === 'update' ? 'update' : 'new',
        ...(card.submissionType === 'update' ? { oldCardNumber: card.serialNumber.trim() } : {}),
        name: card.name,
        color: card.hoodColor.toLowerCase(),
        pawsday: card.birthdate,
        height: card.height,
        shoe_size: sizeRow ? `${sizeRow.eu}EU / ${sizeRow.us}US` : card.shoeSize,
        ...(isInstagram ? { instaUsername: card.socialLink } : { social_link: card.socialLink }),
        country: card.country,
        gear,
        kinks,
        gear_tricks: Object.fromEntries(Object.keys(gear).map((key) => [key, null])),
        kinks_tricks: Object.fromEntries(Object.keys(kinks).map((key) => [key, null])),
        good_boy_title: 'Good Boy',
        rarity: 'common',
        is_custom: true,
        is_published: false,
        is_torn: false,
        is_sample: false,
        is_collectable_only: card.isCollectable ?? false,
        is_online_playable: card.isOnlinePlayable ?? false,
        allow_trades: card.isAllowTrades ?? false,
    };
}
