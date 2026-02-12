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
  "ABDL", "Toys", "Dirty", "BDSM",
  "Cuckolding", "Power Play", "Chastity", "Verbal"
];

export type CardPosition =
  | 'left-top' | 'left-middle' | 'left-bottom'
  | 'right-top' | 'right-middle' | 'right-bottom';

export interface CardData {
  name: string; // Pup Name
  hoodColor: HoodColor;
  imageUrl?: string;
  birthdate: string; // YYYY.MM
  height: string; // Stored as formatted string "1.78m / 5'10""
  shoeSize: string; // Stored as formatted string "44.5EU / 11.5US"
  socialLink: string;
  country: string; // 2 letter code preferably
  consent: boolean;
  decisionConsent: boolean;
  namePosition: CardPosition;
  statsPosition: CardPosition;
  dogTricksPermission: boolean;
  gear: Record<string, number>; // value 0-5
  kinks: Record<string, number>; // value 0-5
  dogTricks: string; // List of dog tricks if under 50 bones
  imageZoom?: number;
  imagePosition?: { x: number; y: number };
  socialPlatform?: 'instagram' | 'other';
}

export interface AIServiceResponse {
  cardData?: Partial<CardData>;
  imageBase64?: string;
  error?: string;
}