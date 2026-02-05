import React from 'react';
import { CardData, HoodColor, CardPosition } from '../types';
import { Bone } from 'lucide-react';

interface CardPreviewProps {
  data: CardData;
}

const ColorMap: Record<HoodColor, string> = {
  [HoodColor.RED]: 'bg-red-600 border-red-600 text-red-500',
  [HoodColor.ORANGE]: 'bg-orange-500 border-orange-500 text-orange-500',
  [HoodColor.YELLOW]: 'bg-yellow-400 border-yellow-400 text-yellow-500',
  [HoodColor.BLUE]: 'bg-blue-600 border-blue-600 text-blue-500',
  [HoodColor.GREEN]: 'bg-green-600 border-green-600 text-green-500',
  [HoodColor.BLACK]: 'bg-slate-900 border-slate-700 text-slate-500',
  [HoodColor.WHITE]: 'bg-slate-100 border-white text-slate-400',
  [HoodColor.BROWN]: 'bg-amber-800 border-amber-800 text-amber-700',
  [HoodColor.PURPLE]: 'bg-purple-600 border-purple-600 text-purple-500',
  [HoodColor.PINK]: 'bg-pink-500 border-pink-500 text-pink-500',
  [HoodColor.GRAY]: 'bg-gray-500 border-gray-500 text-gray-500',
  [HoodColor.CAMO]: 'bg-emerald-800 border-emerald-800 text-emerald-700',
  [HoodColor.MULTI]: 'bg-indigo-500 border-indigo-500 text-indigo-500',
};

// Layout configurations
const GEAR_LEFT = ["Rubber", "Leather", "Sox/Sneaker", "Jocks/Undies"];
const GEAR_RIGHT = ["Furry", "MX/Biker", "Sportswear", "Tactical/Unif."];

const KINKS_LEFT = ["Outdoor/Dares", "Sniffing", "Edging", "Fisting", "ABDL", "Toys"];
const KINKS_RIGHT = ["Cuckolding", "Power Play", "Chastity", "BDSM", "Verbal", "Dirty"];

const CardPreview: React.FC<CardPreviewProps> = ({ data }) => {
  const { name, hoodColor, imageUrl, birthdate, height, shoeSize, socialLink, country, gear, kinks, namePosition, statsPosition } = data;

  const colorClasses = ColorMap[hoodColor] || ColorMap[HoodColor.BLACK];
  const borderColor = colorClasses.split(' ')[1];
  const textColor = colorClasses.split(' ')[2];

  // Helper to render bones with side-specific rotation
  const renderBones = (count: number = 0, side: 'left' | 'right' = 'left') => {
    const rotation = side === 'left' ? '-rotate-90' : 'rotate-90';
    const boneValues = side === 'left' ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

    return (
      <div className="flex gap-0.5 flex-shrink-0">
        {boneValues.map((v) => (
          <Bone
            key={v}
            size={10}
            className={`transform ${rotation} flex-shrink-0 ${v <= count ? 'text-white fill-white' : 'opacity-0'}`}
          />
        ))}
      </div>
    );
  };

  const { totalBones } = React.useMemo(() => {
    let gSum = 0;
    let kSum = 0;
    Object.values(gear).forEach((v) => gSum += (v as number));
    Object.values(kinks).forEach((v) => kSum += (v as number));
    return {
      totalBones: gSum + kSum
    };
  }, [gear, kinks]);

  // Dynamic Positioning Helpers
  const getNameStyles = (pos: CardPosition) => {
    const [side, vertical] = pos.split('-');
    let classes = `absolute z-20 top-8 `;

    // Vertical overrides
    if (vertical === 'middle') classes = `absolute z-20 top-1/2 -translate-y-1/2 `;
    if (vertical === 'bottom') classes = `absolute z-20 bottom-16 `;

    // Side
    if (side === 'left') {
      classes += 'left-0 rounded-r-2xl text-left pl-6 pr-4';
    } else {
      classes += 'right-0 rounded-l-2xl text-right pr-6 pl-4';
    }
    return classes;
  };

  const getStatsStyles = (pos: CardPosition) => {
    const [side, vertical] = pos.split('-');
    let classes = `absolute z-20 flex flex-col gap-1.5 `;

    // Vertical positions
    if (vertical === 'top') classes += 'top-6 ';
    if (vertical === 'middle') classes += 'top-1/2 -translate-y-1/2 ';
    if (vertical === 'bottom') classes += 'bottom-20 ';

    // Side
    if (side === 'left') {
      classes += 'left-0 items-start';
    } else {
      classes += 'right-0 items-end';
    }
    return classes;
  };

  const statsSide = statsPosition.split('-')[0];
  const pillBaseClass = "backdrop-blur-md py-1.5 shadow-lg border border-white/10 text-sm font-bold text-white block min-w-[80px] bg-black/40";

  const pillRoundedClass = statsSide === 'left'
    ? 'rounded-r-xl rounded-l-none pl-4 pr-3 text-center'
    : 'rounded-l-xl rounded-r-none pl-3 pr-4 text-center';


  return (
    <div id="card-preview-container" className={`relative w-[360px] h-auto min-h-[640px] rounded-2xl overflow-hidden bg-black flex flex-col shadow-2xl border-4 ${borderColor} font-sans`}>

      {/* Preview Warning Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center opacity-10">
        <span className="-rotate-45 text-6xl font-black text-white border-2 border-white px-4 py-2 rounded-xl">PREVIEW ONLY</span>
      </div>

      {/* Top Section: Image + Overlays (Name, Stats, Flag) */}
      <div className="relative w-full aspect-[15/14] bg-neutral-900 overflow-hidden group">
        {/* Main Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-200"
            style={{
              transform: `scale(${data.imageZoom || 1}) translate(${(data.imagePosition?.x || 0)}%, ${(data.imagePosition?.y || 0)}%)`
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-600 text-sm font-bold uppercase">Upload Pup Pic</span>
          </div>
        )}

        {/* Name Overlay */}
        <div className={`${getNameStyles(namePosition)} bg-black/40 backdrop-blur-md py-2`}>
          <h2 className="text-2xl font-black text-white drop-shadow-md">
            {name || "PUP NAME"}
          </h2>
        </div>

        {/* Stats Pills Overlay */}
        <div className={getStatsStyles(statsPosition)}>
          <div className={`${pillBaseClass} ${pillRoundedClass}`}>
            {birthdate || "YYYY.MM"}
          </div>
          <div className={`${pillBaseClass} ${pillRoundedClass}`}>
            {height || "-"}
          </div>
          <div className={`${pillBaseClass} ${pillRoundedClass}`}>
            {shoeSize || "-"}
          </div>
          {/* Bone Count Removed from Image as requested */}
        </div>

        {/* Country Flag Overlay - Always Bottom Right */}
        {country && (
          <div className="absolute bottom-0 right-0 z-20">
            <img
              src={`https://flagcdn.com/w80/${country.toLowerCase()}.png`}
              alt={country}
              className="h-8 object-cover border-2 border-white shadow-md rounded-tl-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* Social Overlay */}
        {socialLink && (
          <div className="absolute bottom-10 -right-7 bg-black/0 backdrop-blur-none px-2 py-1 flex items-center gap-1 -rotate-90 origin-bottom-right opacity-60 z-20">
            <span className="text-[10px] text-white font-mono font-bold tracking-wide">{socialLink}</span>
          </div>
        )}
      </div>

      {/* 4. Gear & Kinks Matrix (Bottom Half) */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-hidden bg-black relative z-30">

        {/* GEAR SECTION */}
        <div className="border-b border-neutral-800 pb-1">
          <div className="flex items-center mb-1">
            {/* Vertical Label */}
            <span className={`text-[10px] font-black uppercase -rotate-90 origin-center translate-y-2 w-4 text-center ${textColor} opacity-40`}>Gear</span>

            {/* Gear Columns */}
            <div className="flex-1 flex gap-2 ml-1">
              {/* Left Column: Name Left, Bones Right */}
              <div className="flex-1 space-y-0.5 border-r border-white/10 pr-2">
                {GEAR_LEFT.map(cat => (
                  <div key={cat} className="flex items-center justify-between gap-1 h-4 min-w-0">
                    <span className="text-[10px] text-neutral-300 font-bold truncate pr-1 min-w-0 flex-1">{cat}</span>
                    {renderBones(gear[cat] || 0, 'right')}
                  </div>
                ))}
              </div>
              {/* Right Column: Bones Left, Name Right */}
              <div className="flex-1 space-y-0.5 pl-2">
                {GEAR_RIGHT.map(cat => (
                  <div key={cat} className="flex items-center justify-between gap-1 h-4 min-w-0">
                    {renderBones(gear[cat] || 0, 'left')}
                    <span className="text-[10px] text-neutral-300 font-bold truncate pl-1 min-w-0 flex-1 text-right">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KINKS SECTION */}
        <div className="flex-1">
          <div className="flex h-full">
            {/* Vertical Label */}
            <div className="flex items-center justify-center">
              <span className={`text-[10px] font-black uppercase -rotate-90 w-4 whitespace-nowrap text-center ${textColor} opacity-40`}>Kinks</span>
            </div>

            {/* Kinks Columns */}
            <div className="flex-1 flex gap-2 ml-1 content-start pt-1">
              {/* Left Column: Name Left, Bones Right */}
              <div className="flex-1 space-y-0.5 border-r border-white/10 pr-2">
                {KINKS_LEFT.map(cat => (
                  <div key={cat} className="flex items-center justify-between gap-1 h-4 min-w-0">
                    <span className="text-[10px] text-neutral-300 font-bold truncate pr-1 min-w-0 flex-1">{cat}</span>
                    {renderBones(kinks[cat] || 0, 'right')}
                  </div>
                ))}
              </div>
              {/* Right Column: Bones Left, Name Right */}
              <div className="flex-1 space-y-0.5 pl-2">
                {KINKS_RIGHT.map(cat => (
                  <div key={cat} className="flex items-center justify-between gap-1 h-4 min-w-0">
                    {renderBones(kinks[cat] || 0, 'left')}
                    <span className="text-[10px] text-neutral-300 font-bold truncate pl-1 min-w-0 flex-1 text-right">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer / Total Bones */}
      <div className="bg-neutral-900 px-3 py-1 flex justify-between items-center border-t border-neutral-800 z-30">
        <span className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase">Bone Battle TCG</span>
        <div className="flex items-center gap-1">
          <Bone size={12} className={`transform -rotate-45 ${textColor} fill-current`} />
          <span className={`text-xs font-bold ${textColor}`}>{totalBones} / 70</span>
        </div>
      </div>

    </div>
  );
};

export default CardPreview;