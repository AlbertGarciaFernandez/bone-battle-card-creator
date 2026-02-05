import React, { useState, useEffect } from 'react';
import { CardData, HoodColor, GEAR_CATEGORIES, KINKS_CATEGORIES, CardPosition } from '../types';
import { Image as ImageIcon, Bone, AlertCircle, Upload, Info, Dog } from 'lucide-react';

interface CardFormProps {
  card: CardData;
  setCard: (card: CardData) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}

const POSITION_OPTIONS: { label: string; value: CardPosition }[] = [
  { label: 'Left Top', value: 'left-top' },
  { label: 'Left Middle', value: 'left-middle' },
  { label: 'Left Bottom', value: 'left-bottom' },
  { label: 'Right Top', value: 'right-top' },
  { label: 'Right Middle', value: 'right-middle' },
  { label: 'Right Bottom', value: 'right-bottom' },
];

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "Aland Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Cote d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Curacao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and McDonald Islands" },
  { code: "VA", name: "Holy See (Vatican City State)" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran, Islamic Republic of" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, Democratic People's Republic of" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia, Federated States of" },
  { code: "MD", name: "Moldova, Republic of" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine, State of" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Reunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barthelemy" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin (French part)" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten (Dutch part)" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SZ", name: "Swaziland" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "VG", name: "Virgin Islands, British" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
].sort((a, b) => a.name.localeCompare(b.name));

const GEAR_DESCRIPTIONS: Record<string, string> = {
  "Rubber": "Latex, gummi, masks, suits, that shiny second skin feeling...",
  "Leather": "Classic gear, harnesses, boots, caps, vests, the smell of real leather...",
  "Sox/Sneaker": "Sports socks, sneakers, trainers, white cotton, dirty soles or fresh out of the box...",
  "Jocks/Undies": "Athletic supporters, briefs, boxer briefs, showing off the waistband and athletic form...",
  "Furry": "Fursuits, tails, ears, paw mitts, animal transformation and persona play...",
  "MX/Biker": "Motocross gear, helmets, gloves, heavy padding, boots and high-octane aesthetics...",
  "Sportswear": "Tracksuits, football gear, gym wear, shiny nylon, spandex or mesh...",
  "Tactical/Unif.": "Police, military, security, camo, heavy boots, authority and power play uniforms..."
};

const KINK_DESCRIPTIONS: Record<string, string> = {
  "Outdoor/Dares": "Cruising, risky exhibitionism at public spaces or outdoors, daring tasks or actions where you could be caught...",
  "Sniffing": "Sox, sneakers, underwear, feet, pits, crotch - exploring scents and pheromones...",
  "Edging": "Riding the edge of climax, cum denial, prolonged stimulation and deep focus (gooning)...",
  "Fisting": "Hand or arm penetration, anal stretching, rosebuds and extreme depth play...",
  "ABDL": "Adult baby, diapers, sucking pacifiers, baby bottles, jumpers and regression play...",
  "Toys": "Dildos, plugs, balls, fucking machines and various hardware for stimulation...",
  "Cuckolding": "Sexual arousal from the experience of a partner having sex with someone else (voyeurism, humiliation, submission, or compersion)...",
  "Power Play": "Mental domination, worship, exchanging power, mind control, hypnotism, triggers and psychological manipulation...",
  "Chastity": "Cock cages, clit covers, shrinking, denial and long-term locked states...",
  "BDSM": "Bondage, discipline, dominance, submission, sadism, masochism - physical play involving impact, restraint and pain...",
  "Verbal": "Moaning, calling names, voice messages, whispering, commands and dirty talk...",
  "Dirty": "Spit, piss, mud, puke, scat - exploring bodily fluids and 'messy' play states..."
};

const CardForm: React.FC<CardFormProps> = ({
  card,
  setCard,
  onGenerateImage,
  isGeneratingImage
}) => {
  // Local state for conversions
  const [cm, setCm] = useState<string>('');
  const [ft, setFt] = useState<string>('');
  const [inch, setInch] = useState<string>('');

  const [euShoe, setEuShoe] = useState<string>('');
  const [usShoe, setUsShoe] = useState<string>('');

  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  // Social Platform State
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'other'>('instagram');

  // Custom Country State
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryName, setCustomCountryName] = useState('');

  // Update effect to detect if country provided is in list or custom
  useEffect(() => {
    if (card.country && !COUNTRIES.find(c => c.code === card.country) && card.country !== 'OTHER') {
      // Just keep standard logic if already custom
    }
  }, []);

  const handleChange = (field: keyof CardData, value: any) => {
    setCard({ ...card, [field]: value });
  };

  const handleMatrixChange = (category: 'gear' | 'kinks', key: string, value: number) => {
    const newMap = { ...card[category], [key]: value };
    setCard({ ...card, [category]: newMap });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { gearTotal, kinksTotal, totalBones } = React.useMemo(() => {
    let gSum = 0;
    let kSum = 0;
    Object.values(card.gear).forEach((v) => gSum += (v as number));
    Object.values(card.kinks).forEach((v) => kSum += (v as number));
    return {
      gearTotal: gSum,
      kinksTotal: kSum,
      totalBones: gSum + kSum
    };
  }, [card.gear, card.kinks]);

  const isOverLimit = totalBones > 70;
  const isUnder50 = totalBones < 50;

  // Dog Tricks Calculation
  const missingBones = Math.max(0, 50 - totalBones);
  const requiredTricks = Math.ceil(missingBones / 4);

  // Height Conversion Logic
  const updateHeightFromCm = (val: string) => {
    setCm(val);
    const numM = parseFloat(val);
    if (!isNaN(numM) && numM > 0) {
      const totalInches = (numM * 100) / 2.54; // Convert meters to cm, then to inches
      const f = Math.floor(totalInches / 12);
      const i = Math.round(totalInches % 12);
      setFt(f.toString());
      setInch(i.toString());
      handleChange('height', `${val}m / ${f}'${i}"`);
    } else {
      setFt('');
      setInch('');
      handleChange('height', val);
    }
  };

  const updateHeightFromFtIn = (f: string, i: string) => {
    setFt(f);
    setInch(i);
    const numF = parseFloat(f) || 0;
    const numI = parseFloat(i) || 0;
    if (numF > 0 || numI > 0) {
      const totalInches = (numF * 12) + numI;
      const totalCm = totalInches * 2.54;
      const formattedM = (totalCm / 100).toFixed(2);
      setCm(formattedM);
      handleChange('height', `${formattedM}m / ${numF}'${numI}"`);
    } else {
      setCm('');
      handleChange('height', '');
    }
  };

  // Shoe Conversion Logic (Revised: EU = 32.7 + 1.27 * US)
  const updateShoeFromEu = (val: string) => {
    setEuShoe(val);
    const numEu = parseFloat(val);
    if (!isNaN(numEu) && numEu > 30) {
      // US = (EU - 32.7) / 1.27
      const calcUs = (numEu - 32.7) / 1.27;
      // Round to nearest 0.5
      const roundedUs = Math.round(calcUs * 2) / 2;
      setUsShoe(roundedUs.toString());
      handleChange('shoeSize', `${val}EU / ${roundedUs}US`);
    } else {
      handleChange('shoeSize', val);
    }
  };

  const updateShoeFromUs = (val: string) => {
    setUsShoe(val);
    const numUs = parseFloat(val);
    if (!isNaN(numUs) && numUs > 0) {
      // EU = 32.7 + 1.27 * US
      const calcEu = 32.7 + (1.27 * numUs);
      const roundedEu = Math.round(calcEu * 10) / 10; // 1 decimal place
      setEuShoe(roundedEu.toString());
      handleChange('shoeSize', `${roundedEu}EU / ${val}US`);
    } else {
      handleChange('shoeSize', val);
    }
  };

  // Strict Pawsday Validation (YYYY.MM)
  const handlePawsdayChange = (val: string) => {
    // Check if user is typing valid chars (digits or .)
    if (!/^[\d.]*$/.test(val)) return;

    // Limits
    if (val.length > 7) return;

    // Auto-dot insertion or strict typing? 
    // User requested "prevention to enter something different than stated format YYYY.MM"
    // Let's enforce it strictly on blur or just mask it.

    handleChange('birthdate', val);
  };

  const handlePawsdayBlur = () => {
    // Validate strict format
    if (card.birthdate && !/^\d{4}\.\d{2}$/.test(card.birthdate)) {
      // Maybe clear it or warn?
      // For now, let's just leave it but the pattern attribute handles browser warnings
    }
  };

  return (
    <div className="space-y-6">

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-5">

        {/* Basic Info */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-bone-100">Pup Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Pup Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={card.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                minLength={2}
                maxLength={20}
                className={`w-full bg-slate-900 border rounded-md px-3 py-2 text-sm text-bone-50 focus:border-bone-400 focus:outline-none ${!card.name ? 'border-red-500/50' : 'border-slate-700'
                  }`}
                placeholder="Enter pup name"
              />
              <p className="text-[10px] text-slate-500 mt-1 italic">
                Don't have a name? Ask your alpha, followers or friends to help find one!
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Hood Color <span className="text-red-400">*</span>
              </label>
              <select
                value={card.hoodColor}
                onChange={(e) => handleChange('hoodColor', e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-2 text-sm text-bone-50 focus:border-bone-400 focus:outline-none"
              >
                {Object.values(HoodColor).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                The color you identify as. Choose "Multi" if you don't fit one group (like red vs blue).
              </p>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">Name Position</label>
              <select
                value={card.namePosition}
                onChange={(e) => handleChange('namePosition', e.target.value as CardPosition)}
                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:border-bone-400 outline-none"
              >
                {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">Stats Position</label>
              <select
                value={card.statsPosition}
                onChange={(e) => handleChange('statsPosition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:border-bone-400 outline-none"
              >
                {POSITION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Height Inputs                 */}
            <div className={`bg-slate-900/50 p-4 rounded-lg border ${!card.height ? 'border-red-500/50' : 'border-slate-700'}`}>
              <label className="block text-xs font-medium text-slate-400 mb-3 uppercase">
                Height <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-12">Meters:</span>
                  <input
                    type="number"
                    placeholder="1.78"
                    step="0.01"
                    min="1.00"
                    max="2.50"
                    value={cm}
                    onChange={(e) => updateHeightFromCm(e.target.value)}
                    required
                    className="flex-1 bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-bone-400 outline-none"
                  />
                  <span className="text-xs text-slate-500">m</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-12">Feet:</span>
                  <input
                    type="number"
                    placeholder="5"
                    min="3"
                    max="8"
                    value={ft}
                    onChange={(e) => updateHeightFromFtIn(e.target.value, inch)}
                    className="w-10 bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-bone-400 outline-none"
                  />
                  <span className="text-xs text-slate-500">ft</span>
                  <input
                    type="number"
                    placeholder="10"
                    min="0"
                    max="11"
                    value={inch}
                    onChange={(e) => updateHeightFromFtIn(ft, e.target.value)}
                    className="w-10 bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-bone-400 outline-none"
                  />
                  <span className="text-xs text-slate-500">in</span>
                </div>
              </div>
            </div>

            <div className={`bg-slate-900/50 p-4 rounded-lg border ${!card.shoeSize ? 'border-red-500/50' : 'border-slate-700'}`}>
              <label className="block text-xs font-medium text-slate-400 mb-3 uppercase">
                Shoe Size <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-12">EU:</span>
                  <input
                    type="number"
                    placeholder="44"
                    min="35"
                    max="50"
                    value={euShoe}
                    onChange={(e) => updateShoeFromEu(e.target.value)}
                    required
                    className="flex-1 bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-bone-400 outline-none"
                  />
                  <span className="text-xs text-slate-500">EU</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-12">US:</span>
                  <input
                    type="number"
                    placeholder="11"
                    min="4"
                    max="16"
                    value={usShoe}
                    onChange={(e) => updateShoeFromUs(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-bone-400 outline-none"
                  />
                  <span className="text-xs text-slate-500">US</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
                Pawsday (YYYY.MM) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="2021.05"
                pattern="\d{4}\.\d{2}"
                value={card.birthdate}
                onChange={(e) => handlePawsdayChange(e.target.value)}
                onBlur={handlePawsdayBlur}
                required
                className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${!card.birthdate || !/^\d{4}\.\d{2}$/.test(card.birthdate) ? 'border-red-500/50' : 'border-slate-700'
                  }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
                Country <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                {!isCustomCountry ? (
                  <select
                    value={card.country}
                    onChange={(e) => {
                      if (e.target.value === 'OTHER') {
                        setIsCustomCountry(true);
                        handleChange('country', '');
                      } else {
                        handleChange('country', e.target.value);
                      }
                    }}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                    <option value="OTHER">+ Other / Custom</option>
                  </select>
                ) : (
                  <div className="flex gap-1 w-full">
                    <input
                      type="text"
                      placeholder="Country Code (e.g. FR, DE)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none"
                      value={card.country}
                      onChange={(e) => handleChange('country', e.target.value.toUpperCase().slice(0, 3))}
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCountry(false)}
                      className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded hover:text-white"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
              Social Link <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="socialPlatform"
                    checked={socialPlatform === 'instagram'}
                    onChange={() => setSocialPlatform('instagram')}
                    className="w-3 h-3 accent-purple-500"
                  />
                  <span className="text-xs text-slate-300">Instagram</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="socialPlatform"
                    checked={socialPlatform === 'other'}
                    onChange={() => setSocialPlatform('other')}
                    className="w-3 h-3 accent-purple-500"
                  />
                  <span className="text-xs text-slate-300">Other</span>
                </label>
              </div>
              <input
                type="text"
                placeholder={socialPlatform === 'instagram' ? "@username" : "linktr.ee/..."}
                value={card.socialLink}
                onChange={(e) => handleChange('socialLink', e.target.value)}
                required
                className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${!card.socialLink ? 'border-red-500/50' : 'border-slate-700'
                  }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
              Image <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://... or upload"
                  value={card.imageUrl || ''}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  required
                  className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${!card.imageUrl ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                />
              </div>
              <label className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md cursor-pointer border border-slate-600 flex items-center justify-center transition-colors" title="Upload Image">
                <Upload size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button
                type="button"
                onClick={onGenerateImage}
                disabled={isGeneratingImage || !card.name}
                className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md flex items-center justify-center transition-colors border border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate AI Image"
              >
                {isGeneratingImage ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <ImageIcon size={14} />}
              </button>
            </div>
          </div>

          {/* Image Adjustments */}
          <div className={`mt-2 bg-slate-900/40 p-3 rounded-lg border ${!card.imageUrl ? 'opacity-30 pointer-events-none' : 'border-slate-700'} space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={12} className="text-slate-500" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop & Position</label>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleChange('imageZoom', 1);
                  handleChange('imagePosition', { x: 0, y: 0 });
                }}
                className="text-[9px] text-slate-500 hover:text-white underline decoration-slate-700"
              >
                Reset View
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Zoom Slider */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-bold">
                  <span>ZOOM</span>
                  <span className="text-bone-400">{Math.round((card.imageZoom || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.01"
                  value={card.imageZoom || 1}
                  onChange={(e) => handleChange('imageZoom', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-bone-500 hover:accent-bone-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* X Position */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-bold">
                    <span>POS X</span>
                    <span className="text-bone-400">{(card.imagePosition?.x || 0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={card.imagePosition?.x || 0}
                    onChange={(e) => handleChange('imagePosition', { ...(card.imagePosition || { x: 0, y: 0 }), x: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-bone-500 hover:accent-bone-400 transition-all"
                  />
                </div>

                {/* Y Position */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-bold">
                    <span>POS Y</span>
                    <span className="text-bone-400">{(card.imagePosition?.y || 0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={card.imagePosition?.y || 0}
                    onChange={(e) => handleChange('imagePosition', { ...(card.imagePosition || { x: 0, y: 0 }), y: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-bone-500 hover:accent-bone-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BONE MATRIX */}
        <div className={`p-4 rounded-lg border ${isOverLimit ? 'bg-red-950/30 border-red-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-300">Bone Values</h4>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isOverLimit ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-slate-800 border-slate-600 text-bone-200'}`}>
              {isOverLimit && <AlertCircle size={12} />}
              <span>{totalBones} / 70 Max</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Gear Column */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1">Gear</h5>
              {[...GEAR_CATEGORIES].slice(0, 4).map(item => (
                <div key={item} className="grid items-center justify-between gap-1.5 group relative">
                  <div className="flex items-center gap-1 flex-shrink-0" style={{ maxWidth: '85px' }}>
                    <span className="text-[11px] text-slate-400 truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setActiveInfo(activeInfo === item ? null : item)}
                      onMouseEnter={() => setActiveInfo(item)}
                      onMouseLeave={() => setActiveInfo(null)}
                      className="focus:outline-none"
                    >
                      <Info size={11} className={`${activeInfo === item ? 'text-bone-300' : 'text-slate-600'} cursor-help hover:text-slate-300 transition-colors`} />
                    </button>
                  </div>
                  <div className="flex gap-0.5 bg-slate-800/50 rounded p-0.5 flex-shrink-0">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleMatrixChange('gear', item, v)}
                        className={`w-[18px] h-[18px] rounded-sm flex items-center justify-center transition-all ${(card.gear[item] || 0) >= v && v > 0
                          ? 'bg-bone-200 text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-700 hover:text-slate-400'
                          }`}
                      >
                        {v === 0 ? <span className="text-[8px] text-slate-500 font-bold">x</span> : <Bone size={9} className="fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Gear Right Column */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1 opacity-0">Gear</h5>
              {[...GEAR_CATEGORIES].slice(4).map(item => (
                <div key={item} className="grid items-center justify-between gap-1.5 group relative">
                  <div className="flex items-center gap-1 flex-shrink-0" style={{ maxWidth: '85px' }}>
                    <span className="text-[11px] text-slate-400 truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setActiveInfo(activeInfo === item ? null : item)}
                      onMouseEnter={() => setActiveInfo(item)}
                      onMouseLeave={() => setActiveInfo(null)}
                      className="focus:outline-none"
                    >
                      <Info size={11} className={`${activeInfo === item ? 'text-bone-300' : 'text-slate-600'} cursor-help hover:text-slate-300 transition-colors`} />
                    </button>
                  </div>
                  <div className="flex gap-0.5 bg-slate-800/50 rounded p-0.5 flex-shrink-0">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleMatrixChange('gear', item, v)}
                        className={`w-[18px] h-[18px] rounded-sm flex items-center justify-center transition-all ${(card.gear[item] || 0) >= v && v > 0
                          ? 'bg-bone-200 text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-700 hover:text-slate-400'
                          }`}
                      >
                        {v === 0 ? <span className="text-[8px] text-slate-500 font-bold">x</span> : <Bone size={9} className="fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Kinks Column */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1">Into</h5>
              {[...KINKS_CATEGORIES].slice(0, 6).map(item => (
                <div key={item} className="grid items-center justify-between gap-1.5 group relative">
                  <div className="flex items-center gap-1 flex-shrink-0" style={{ maxWidth: '85px' }}>
                    <span className="text-[11px] text-slate-400 truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setActiveInfo(activeInfo === item ? null : item)}
                      onMouseEnter={() => setActiveInfo(item)}
                      onMouseLeave={() => setActiveInfo(null)}
                      className="focus:outline-none"
                    >
                      <Info size={11} className={`${activeInfo === item ? 'text-bone-300' : 'text-slate-600'} cursor-help hover:text-slate-300 transition-colors`} />
                    </button>
                  </div>
                  <div className="flex gap-0.5 bg-slate-800/50 rounded p-0.5 flex-shrink-0">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleMatrixChange('kinks', item, v)}
                        className={`w-[18px] h-[18px] rounded-sm flex items-center justify-center transition-all ${(card.kinks[item] || 0) >= v && v > 0
                          ? 'bg-bone-200 text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-700 hover:text-slate-400'
                          }`}
                      >
                        {v === 0 ? <span className="text-[8px] text-slate-500 font-bold">x</span> : <Bone size={9} className="fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Kinks Right Column */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1 opacity-0">Into</h5>
              {[...KINKS_CATEGORIES].slice(6).map(item => (
                <div key={item} className="grid items-center justify-between gap-1.5 group relative">
                  <div className="flex items-center gap-1 flex-shrink-0" style={{ maxWidth: '85px' }}>
                    <span className="text-[11px] text-slate-400 truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setActiveInfo(activeInfo === item ? null : item)}
                      onMouseEnter={() => setActiveInfo(item)}
                      onMouseLeave={() => setActiveInfo(null)}
                      className="focus:outline-none"
                    >
                      <Info size={11} className={`${activeInfo === item ? 'text-bone-300' : 'text-slate-600'} cursor-help hover:text-slate-300 transition-colors`} />
                    </button>
                  </div>
                  <div className="flex gap-0.5 bg-slate-800/50 rounded p-0.5 flex-shrink-0">
                    {[0, 1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleMatrixChange('kinks', item, v)}
                        className={`w-[18px] h-[18px] rounded-sm flex items-center justify-center transition-all ${(card.kinks[item] || 0) >= v && v > 0
                          ? 'bg-bone-200 text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-700 hover:text-slate-400'
                          }`}
                      >
                        {v === 0 ? <span className="text-[8px] text-slate-500 font-bold">x</span> : <Bone size={9} className="fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Info Panel */}
          <div className="mt-6 min-h-[90px] relative">
            <div className={`p-4 rounded-lg border transition-all duration-300 ${activeInfo
              ? 'bg-slate-950/80 border-bone-500/30'
              : 'bg-slate-900/10 border-slate-800/50 opacity-40'
              }`}>
              {activeInfo ? (
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-bone-400 animate-pulse" />
                    <span className="text-xs font-black text-bone-200 uppercase tracking-widest">{activeInfo}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">
                    {KINK_DESCRIPTIONS[activeInfo] || GEAR_DESCRIPTIONS[activeInfo] || "Selection details..."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-slate-600">
                  <Info size={18} className="mb-1 opacity-20" />
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 italic">Hover or Click icons for details</span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Summary inside Bone Values container */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap items-center justify-end gap-4">
            <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 shadow-inner transition-colors ${isOverLimit ? 'bg-red-900/20 border-red-500/50 text-red-200 shadow-red-900/40' : 'bg-slate-950/50 border-slate-600 text-bone-100 shadow-black'
              }`}>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold opacity-60">Grand Total</span>
                <span className="text-lg font-black leading-none">{totalBones} <span className="text-xs font-normal opacity-40">/ 70</span></span>
              </div>
              <Bone size={24} className={`${isOverLimit ? 'text-red-500' : 'text-bone-400'} fill-current`} />
            </div>
          </div>

          {/* DOG TRICKS SECTION */}
          {isUnder50 && (
            <div className={`mt-4 p-4 rounded-lg border transition-colors ${card.dogTricksPermission ? 'bg-amber-950/20 border-amber-600/50' : 'bg-slate-900/50 border-slate-700'}`}>
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={card.dogTricksPermission}
                  onChange={(e) => handleChange('dogTricksPermission', e.target.checked)}
                  className="mt-1 accent-amber-500 cursor-pointer w-4 h-4"
                />
                <div>
                  <h5 className="text-xs font-bold text-amber-200">Bones Under 50 Balance</h5>
                  <p className="text-[10px] text-amber-400/80 leading-tight mt-0.5">
                    Check this box if you agree to perform Dog Tricks to balance your card strength.
                  </p>
                </div>
              </div>

              {card.dogTricksPermission && (
                <div className="mt-3 pl-7 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2 text-amber-300">
                    <Dog size={14} className="fill-current" />
                    <span className="text-[11px] font-bold">
                      Required: Select {requiredTricks} Dog Trick{requiredTricks !== 1 && 's'} (1 per 4 missing bones)
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-slate-950 border border-amber-900/50 rounded-md p-2 text-xs text-amber-100 placeholder-amber-900/30 focus:border-amber-500/50 focus:outline-none min-h-[60px]"
                    placeholder={`List your ${requiredTricks} dog tricks here...`}
                    value={card.dogTricks || ''}
                    onChange={(e) => handleChange('dogTricks', e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <a
                      href="https://ugc.production.linktr.ee/cd8abbd3-c2bf-4cd2-ac46-5a4ebe5d47db_Bone-Battle---Dog-Tricks-Cheat-Sheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-amber-500 hover:text-amber-400 underline decoration-dotted"
                    >
                      View Dog Tricks Cheat Sheet
                    </a>
                    <span className="text-[9px] text-amber-600/60">
                      Short by {missingBones} bones
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div className={`flex items-start gap-3 p-3 rounded-lg border ${!card.consent ? 'bg-red-900/20 border-red-500/50' : 'bg-blue-900/20 border-blue-500/30'
          }`}>
          <input
            type="checkbox"
            checked={card.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            required
            className="mt-1 cursor-pointer w-4 h-4 accent-blue-500"
          />
          <p className="text-xs text-blue-200">
            <span className="text-red-400">*</span> I give permission for using my image and information to create and promote this card for Bone Battle.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CardForm;