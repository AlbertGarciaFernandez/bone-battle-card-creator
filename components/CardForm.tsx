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
                className={`w-full bg-slate-900 border rounded-md px-3 py-2 text-sm text-bone-50 focus:border-bone-400 focus:outline-none ${!card.name ? 'border-red-500/50' : 'border-slate-700'
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
                onChange={(e) => handleChange('birthdate', e.target.value)}
                required
                className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${!card.birthdate ? 'border-red-500/50' : 'border-slate-700'
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
              className={`w-full bg-slate-900 border rounded-md px-2 py-1.5 text-xs text-white focus:border-bone-400 focus:outline-none ${!card.socialLink ? 'border-red-500/50' : 'border-slate-700'
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