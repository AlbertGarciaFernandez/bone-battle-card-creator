import React, { useState } from 'react';
import { CardData, HoodColor, GEAR_CATEGORIES, KINKS_CATEGORIES, CardPosition } from '../types';
import { Image as ImageIcon, Bone, AlertCircle, Upload, Info } from 'lucide-react';

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

// Filter stats positions to avoid overlap with name position
const getAvailableStatsPositions = (namePosition: CardPosition) => {
  const nameSide = namePosition.split('-')[0];
  // Stats should be on the opposite side of the name
  return POSITION_OPTIONS.filter(opt => !opt.value.startsWith(nameSide));
};

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
].sort((a, b) => a.name.localeCompare(b.name));

const KINK_DESCRIPTIONS: Record<string, string> = {
  "Outdoor/Dares": "Cruising, risky exhib at public spaces or outdoor, daring tasks or actions where you could be caught at...",
  "Sniffing": "Sox, sneaker, underwear, feet, pits, crotch...",
  "Edging": "Riding the edge, cum denial, maybe even some gooning...",
  "Fisting": "Fist, foot, anal stretching, rosebuds...",
  "ABDL": "Adult baby, diapers, sucking pacifier, baby bottle, jumpers...",
  "Toys": "Dildos, plugs, balls, fucking machine...",
  "Cuckolding": "Sexual arousal from the experience of a partner having sex with someone else (voyeurism, humiliation, submission, or compersion); (consensual) cheating...",
  "Power Play": "More about mental than physical; worshipping; exchanging power by getting control over your/someones mind; dominating by words; brainwashing; manipulating; hypnotizing; blackmailing, 'tell me what to do', finding the right triggers and buttons and using them on you/them...",
  "Chastity": "Cock cages in all kinds of forms, shrinking, denial...",
  "BDSM": "Bondage, discipline, dom/sub, sado/maso .... think about it as a more physical play including pain",
  "Verbal": "Moaning, calling names, voice-messages, whispering in your ears...",
  "Dirty": "Spit, piss, mud, puke, scat..."
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

  const totalBones = React.useMemo(() => {
    let sum = 0;
    Object.values(card.gear).forEach((v) => sum += (v as number));
    Object.values(card.kinks).forEach((v) => sum += (v as number));
    return sum;
  }, [card.gear, card.kinks]);

  const isOverLimit = totalBones > 70;
  const isUnder50 = totalBones < 50;

  // Height Conversion Logic
  const updateHeightFromCm = (val: string) => {
    setCm(val);
    const numCm = parseFloat(val);
    if (!isNaN(numCm)) {
      const totalInches = numCm / 2.54;
      const f = Math.floor(totalInches / 12);
      const i = Math.round(totalInches % 12);
      setFt(f.toString());
      setInch(i.toString());
      handleChange('height', `${val}m / ${f}'${i}"`);
    } else {
      handleChange('height', val);
    }
  };

  const updateHeightFromFtIn = (f: string, i: string) => {
    setFt(f);
    setInch(i);
    const numF = parseFloat(f) || 0;
    const numI = parseFloat(i) || 0;
    if (numF > 0 || numI > 0) {
        const totalCm = ((numF * 12) + numI) * 2.54;
        const formattedCm = (totalCm / 100).toFixed(2);
        setCm(formattedCm);
        handleChange('height', `${formattedCm}m / ${numF}'${numI}"`);
    }
  };

  // Shoe Conversion Logic (Approximate: EU = US + 33 for simplicity in game context)
  const updateShoeFromEu = (val: string) => {
    setEuShoe(val);
    const numEu = parseFloat(val);
    if (!isNaN(numEu)) {
        const calcUs = numEu - 33;
        setUsShoe(calcUs.toString());
        handleChange('shoeSize', `${val}EU / ${calcUs}US`);
    } else {
        handleChange('shoeSize', val);
    }
  };

  const updateShoeFromUs = (val: string) => {
    setUsShoe(val);
    const numUs = parseFloat(val);
    if (!isNaN(numUs)) {
        const calcEu = numUs + 33;
        setEuShoe(calcEu.toString());
        handleChange('shoeSize', `${calcEu}EU / ${val}US`);
    } else {
        handleChange('shoeSize', val);
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
                        className={`w-full bg-slate-900 border rounded-md px-3 py-2 text-sm text-bone-50 focus:border-bone-400 focus:outline-none ${
                          !card.name ? 'border-red-500/50' : 'border-slate-700'
                        }`}
                        placeholder="Enter pup name"
                    />
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
                </div>
            </div>

            {/* Layout Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
               <div>
                  <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">Name Position</label>
                  <select
                      value={card.namePosition}
                      onChange={(e) => {
                        const newNamePos = e.target.value as CardPosition;
                        handleChange('namePosition', newNamePos);
                        // Auto-adjust stats position if it conflicts
                        const available = getAvailableStatsPositions(newNamePos);
                        if (!available.some(opt => opt.value === card.statsPosition)) {
                          handleChange('statsPosition', available[0]?.value || 'right-middle');
                        }
                      }}
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
                      {getAvailableStatsPositions(card.namePosition).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Height Inputs */}
                 <div className={`bg-slate-900/50 p-3 rounded-lg border ${!card.height ? 'border-red-500/50' : 'border-slate-700'}`}>
                    <label className="block text-[10px] font-medium text-slate-400 mb-2 uppercase">
                      Height (Meters / Ft) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                placeholder="1.78"
                                step="0.01"
                                min="1.00"
                                max="2.50"
                                value={cm}
                                onChange={(e) => updateHeightFromCm(e.target.value)}
                                required
                                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-bone-400 outline-none"
                            />
                            <span className="absolute right-2 top-1 text-[10px] text-slate-500">m</span>
                        </div>
                        <span className="text-slate-500">=</span>
                        <div className="flex gap-1 flex-1">
                             <input
                                type="number"
                                placeholder="5"
                                min="3"
                                max="8"
                                value={ft}
                                onChange={(e) => updateHeightFromFtIn(e.target.value, inch)}
                                className="w-full bg-slate-950 border border-slate-600 rounded px-1 py-1 text-xs text-white focus:border-bone-400 outline-none"
                            />
                            <span className="text-[10px] text-slate-500 self-center">ft</span>
                            <input
                                type="number"
                                placeholder="10"
                                min="0"
                                max="11"
                                value={inch}
                                onChange={(e) => updateHeightFromFtIn(ft, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-600 rounded px-1 py-1 text-xs text-white focus:border-bone-400 outline-none"
                            />
                            <span className="text-[10px] text-slate-500 self-center">in</span>
                        </div>
                    </div>
                 </div>

                 {/* Shoe Inputs */}
                 <div className={`bg-slate-900/50 p-3 rounded-lg border ${!card.shoeSize ? 'border-red-500/50' : 'border-slate-700'}`}>
                    <label className="block text-[10px] font-medium text-slate-400 mb-2 uppercase">
                      Shoe Size (EU / US) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                placeholder="44"
                                min="35"
                                max="50"
                                value={euShoe}
                                onChange={(e) => updateShoeFromEu(e.target.value)}
                                required
                                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-bone-400 outline-none"
                            />
                            <span className="absolute right-2 top-1 text-[10px] text-slate-500">EU</span>
                        </div>
                         <span className="text-slate-500">=</span>
                         <div className="relative flex-1">
                            <input
                                type="number"
                                placeholder="11"
                                min="4"
                                max="16"
                                value={usShoe}
                                onChange={(e) => updateShoeFromUs(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-bone-400 outline-none"
                            />
                            <span className="absolute right-2 top-1 text-[10px] text-slate-500">US</span>
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
                        onChange={(e) => handleChange('birthdate', e.target.value)}
                        required
                        className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${
                          !card.birthdate ? 'border-red-500/50' : 'border-slate-700'
                        }`}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={card.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none"
                    >
                        {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase">
                  Social Link <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    placeholder="@username or linktr.ee/..."
                    value={card.socialLink}
                    onChange={(e) => handleChange('socialLink', e.target.value)}
                    required
                    className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${
                      !card.socialLink ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                />
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
                            className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${
                              !card.imageUrl ? 'border-red-500/50' : 'border-slate-700'
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
                        {isGeneratingImage ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"/> : <ImageIcon size={14} />}
                    </button>
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
                <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1">Gear</h5>
                    {GEAR_CATEGORIES.map(item => (
                        <div key={item} className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">{item}</span>
                            <div className="flex gap-0.5 bg-slate-800 rounded p-0.5">
                                {[0, 1, 2, 3, 4, 5].map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => handleMatrixChange('gear', item, v)}
                                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-all ${
                                            (card.gear[item] || 0) >= v && v > 0
                                            ? 'bg-bone-200 text-slate-900' 
                                            : 'text-slate-600 hover:bg-slate-700'
                                        }`}
                                    >
                                        {v === 0 ? <span className="text-[8px] text-slate-500">x</span> : <Bone size={8} className="fill-current" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kinks Column */}
                <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-1">Into</h5>
                    {KINKS_CATEGORIES.map(item => (
                        <div key={item} className="flex items-center justify-between group relative">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400">{item}</span>
                                <div className="group/info relative">
                                    <Info size={12} className="text-slate-600 cursor-help hover:text-slate-300 transition-colors" />
                                    {/* Tooltip */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-800 text-[10px] text-slate-200 rounded shadow-xl border border-slate-600 opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-50 leading-tight">
                                        {KINK_DESCRIPTIONS[item] || "No description available."}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-600"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5 bg-slate-800 rounded p-0.5">
                                {[0, 1, 2, 3, 4, 5].map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => handleMatrixChange('kinks', item, v)}
                                        className={`w-4 h-4 rounded-sm flex items-center justify-center transition-all ${
                                            (card.kinks[item] || 0) >= v && v > 0
                                            ? 'bg-bone-200 text-slate-900' 
                                            : 'text-slate-600 hover:bg-slate-700'
                                        }`}
                                    >
                                        {v === 0 ? <span className="text-[8px] text-slate-500">x</span> : <Bone size={8} className="fill-current" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Conditional Checkbox for < 50 Bones */}
            {isUnder50 && (
                <div className="mt-4 p-3 bg-amber-900/20 border border-amber-600/50 rounded-lg flex items-start gap-3">
                     <input 
                        type="checkbox" 
                        checked={card.dogTricksPermission} 
                        onChange={(e) => handleChange('dogTricksPermission', e.target.checked)}
                        className="mt-1 accent-amber-500 cursor-pointer w-4 h-4"
                     />
                     <div>
                        <p className="text-xs text-amber-200 font-medium">
                            Total bones under 50 (min 40).
                        </p>
                        <p className="text-[10px] text-amber-400/80 leading-tight">
                            Consider adding "Dog Tricks" boosters to balance the card. I give permission for that.
                        </p>
                     </div>
                </div>
            )}
        </div>

        <div className={`flex items-start gap-3 p-3 rounded-lg border ${
          !card.consent ? 'bg-red-900/20 border-red-500/50' : 'bg-blue-900/20 border-blue-500/30'
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