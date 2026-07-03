export enum HoodColor {
  RED = 'Red',
  ORANGE = 'Orange',
  YELLOW = 'Yellow',
  BLUE = 'Blue',
  GREEN = 'Green',
  BLACK = 'Black',
  WHITE = 'White',
  BROWN = 'Brown',
  PURPLE = 'Purple',
  PINK = 'Pink',
  GRAY = 'Gray',
  CAMO = 'Camo',
  MULTI = 'Multi'
}

export const GEAR_CATEGORIES = [
  "Rubber", "Leather", "Sox/Sneaker", "Jocks/Undies",
  "Furry", "MX/Biker", "Sportswear", "Tactical/Unif."
];

export const KINKS_CATEGORIES = [
  "Outdoor/Dares", "Sniffing", "Edging", "Fisting",
  "ABDL", "Toys",
  "Cuckolding", "Power Play", "Chastity", "BDSM", "Verbal", "Dirty"
];

export const SHOE_SIZE_ROWS = [
  { eu: '34',   uk: '2',    us: '3' },
  { eu: '34.5', uk: '2.5',  us: '3.5' },
  { eu: '35',   uk: '3',    us: '4' },
  { eu: '35.5', uk: '3.5',  us: '4.5' },
  { eu: '36',   uk: '4',    us: '5' },
  { eu: '36.5', uk: '4',    us: '5' },
  { eu: '37',   uk: '4.5',  us: '5.5' },
  { eu: '37.5', uk: '5',    us: '6' },
  { eu: '38',   uk: '5.5',  us: '6.5' },
  { eu: '38.5', uk: '5.5',  us: '6.5' },
  { eu: '39',   uk: '6',    us: '7' },
  { eu: '39.5', uk: '6.5',  us: '7.5' },
  { eu: '40',   uk: '7',    us: '8' },
  { eu: '40.5', uk: '7.5',  us: '8.5' },
  { eu: '41',   uk: '7.5',  us: '8.5' },
  { eu: '41.5', uk: '8',    us: '9' },
  { eu: '42',   uk: '8.5',  us: '9.5' },
  { eu: '42.5', uk: '9',    us: '10' },
  { eu: '43',   uk: '9.5',  us: '10.5' },
  { eu: '43.5', uk: '9.5',  us: '10.5' },
  { eu: '44',   uk: '10',   us: '11' },
  { eu: '44.5', uk: '10.5', us: '11.5' },
  { eu: '45',   uk: '11',   us: '12' },
  { eu: '45.5', uk: '11.5', us: '12.5' },
  { eu: '46',   uk: '11.5', us: '12.5' },
  { eu: '46.5', uk: '12',   us: '13' },
  { eu: '47',   uk: '12.5', us: '13.5' },
  { eu: '47.5', uk: '13',   us: '14' },
  { eu: '48',   uk: '13',   us: '14' },
  { eu: '48.5', uk: '13.5', us: '14.5' },
  { eu: '49',   uk: '14',   us: '15' },
  { eu: '49.5', uk: '14.5', us: '15.5' },
  { eu: '50',   uk: '15',   us: '16' },
];

export type CardPosition =
  | 'left-top' | 'left-middle' | 'left-bottom'
  | 'right-top' | 'right-middle' | 'right-bottom';

export interface CardData {
  name: string; // Pup Name
  hoodColor: HoodColor;
  imageUrl?: string;
  birthdate: string; // YYYY.MM format — Pawsday, the puppy's birthday (birth date as a pup)
  height: string; // Stored as formatted string "1.78m / 5'10"" (meters to feet/inches conversion)
  shoeSize: string; // Stored as the selected EU shoe size for JSON/export consistency
  socialLink: string;
  country: string; // 2 letter code preferably
  termsConsent: boolean;
  decisionConsent: boolean;
  isCollectable?: boolean;
  isOnlinePlayable?: boolean;
  isAllowTrades?: boolean;
  namePosition: CardPosition;
  statsPosition: CardPosition;
  dogTricksPermission: boolean;
  gear: Record<string, number>; // value 0-5
  kinks: Record<string, number>; // value 0-5
  dogTricks: string[]; // Selected dog tricks if under 50 bones
  imageZoom?: number;
  imagePosition?: { x: number; y: number };
  socialPlatform?: 'instagram' | 'other';
  contactPlatform?: 'instagram' | 'telegram';
  telegramHandle?: string;
  instagramHandle?: string; // Only used when socialPlatform is 'other' + contactPlatform is 'instagram'
}

export interface AIServiceResponse {
  cardData?: Partial<CardData>;
  imageBase64?: string;
  error?: string;
}
