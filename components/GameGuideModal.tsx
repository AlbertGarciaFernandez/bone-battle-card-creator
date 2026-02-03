import React, { useState, useEffect } from 'react';
import { X, BookOpen, Printer, Users, Box, ArrowRight, Globe, Shield, Zap, Layers, MapPin, CreditCard } from 'lucide-react';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'basics' | 'diagram';
}

const GameGuideModal: React.FC<GameGuideModalProps> = ({ isOpen, onClose, initialTab = 'basics' }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'diagram'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-bone-500/20 p-2 rounded-lg">
                <BookOpen className="text-bone-200 w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white font-display">Bone Battle Guide</h2>
                <p className="text-xs text-slate-400">Rules, Mechanics & Ecosystem</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0">
            <button 
                onClick={() => setActiveTab('basics')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'basics' ? 'border-bone-500 text-bone-100 bg-slate-800/30' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/10'}`}
            >
                What is Bone Battle?
            </button>
            <button 
                onClick={() => setActiveTab('diagram')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'diagram' ? 'border-blue-500 text-blue-100 bg-blue-900/10' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/10'}`}
            >
                Collect, Create & Print
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            
            {/* --- TAB: BASICS --- */}
            {activeTab === 'basics' && (
                <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Intro */}
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-display font-bold text-white">Strategic Card Dueling</h3>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            <strong className="text-bone-400">Bone Battle</strong> is a strategic card dueling and collecting game built entirely from unique Pup Cards featuring <strong className="text-white">real pups</strong>. Each card represents their personal interests in <span className="text-yellow-500">GEAR</span> and <span className="text-purple-400">KINKS</span>.
                        </p>
                    </div>

                    {/* Cards Breakdown */}
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-bone-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-bone-300">
                                <Users size={24} />
                                <h4 className="font-bold text-lg uppercase">Pup Cards</h4>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Your combat units. They feature Bone Counts across two main categories. Some rows replace a Bone count with a <strong className="text-white">Dog Trick</strong> (Attribute Ability).
                            </p>
                         </div>
                         <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-bone-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4 text-yellow-500">
                                <Zap size={24} />
                                <h4 className="font-bold text-lg uppercase">Special Abilities</h4>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Each card has a <strong className="text-white">Color</strong> (the pup's main hood color) that grants a unique Special Ability during gameplay, adding depth to your strategy.
                            </p>
                         </div>
                    </div>

                    {/* Mechanics */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                             <Layers className="text-blue-400" size={28} />
                             <h3 className="text-2xl font-bold text-white">Game Mechanics</h3>
                        </div>
                        <div className="space-y-4 text-slate-300">
                            <p>
                                The core gameplay revolves around a unique <strong className="text-white">four-part Bone Count calculation</strong>. 
                                It demands careful card selection and prediction.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base marker:text-blue-500">
                                <li>Manage your hand wisely.</li>
                                <li>Choose the right <strong className="text-yellow-500">GEAR</strong> or <strong className="text-purple-400">KINKS</strong> row to attack.</li>
                                <li>Strategically use the opposing category to counter.</li>
                                <li>Master 3 Game Modes: <span className="text-white font-mono">Alpha</span>, <span className="text-white font-mono">Beta</span>, <span className="text-white font-mono">Omega</span>.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Deck Building */}
                    <div className="space-y-6">
                         <h3 className="text-2xl font-bold text-white text-center">How to Build Your Deck</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Globe size={100} />
                                </div>
                                <h4 className="font-bold text-green-400 mb-2">1. Individual Collection</h4>
                                <p className="text-sm text-slate-400">
                                    Collect cards directly from the <strong className="text-green-200">Pups</strong> themselves! Pups create cards as kinky business cards to be part of the game.
                                </p>
                            </div>
                            <div className="bg-orange-900/10 border border-orange-500/30 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Box size={100} />
                                </div>
                                <h4 className="font-bold text-orange-400 mb-2">2. Starter Packs</h4>
                                <p className="text-sm text-slate-400">
                                    Get a starter pack (10 random cards) from <strong className="text-orange-200">joker.pup.jx</strong> in person at events.
                                    <br/><span className="text-xs opacity-70 italic">(Not sold online, free treat for pups!)</span>
                                </p>
                            </div>
                         </div>
                    </div>
                </div>
            )}


            {/* --- TAB: DIAGRAM --- */}
            {activeTab === 'diagram' && (
                <div className="min-w-[768px] mx-auto animate-in fade-in duration-500 p-4">
                    
                    {/* Diagram Container */}
                    <div className="relative grid grid-cols-3 gap-8">
                        
                        {/* COLUMN 1: COLLECTOR (Green) */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-green-950/40 border-2 border-green-600/50 p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(22,163,74,0.1)]">
                                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-900 shadow-lg">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-black text-green-400 uppercase tracking-widest">Collector</h3>
                                <p className="text-xs text-green-200/70 mt-1 font-mono">"Tries to fetch them all"</p>
                            </div>

                            {/* Flow Items */}
                            <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-dashed border-green-800/50 ml-6 pb-4">
                                <div className="bg-slate-800 p-4 rounded-xl border border-green-900/50 flex items-center gap-3">
                                    <Users size={18} className="text-green-500 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-200 font-bold">Individual Pup Cards</p>
                                        <p className="text-xs text-slate-500">Collected from pups directly</p>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-800 p-4 rounded-xl border border-green-900/50 flex items-center gap-3">
                                    <Box size={18} className="text-green-500 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-200 font-bold">Starter Packs</p>
                                        <p className="text-xs text-slate-500">At events (Free)</p>
                                    </div>
                                </div>

                                <div className="bg-slate-800 p-4 rounded-xl border border-green-900/50 flex items-center gap-3 opacity-70">
                                    <Globe size={18} className="text-green-500 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-200 font-bold">Shipment</p>
                                        <p className="text-xs text-slate-500">If cannot meet in person</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: JOKER (Center Hub) */}
                        <div className="flex flex-col items-center gap-6 pt-12">
                             <div className="bg-slate-100 text-slate-900 p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(255,255,255,0.1)] z-10 border-4 border-slate-800">
                                <span className="font-display font-black text-lg">JOKER</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Creator</span>
                             </div>

                             {/* Vertical Line */}
                             <div className="w-1 bg-gradient-to-b from-slate-700 to-transparent h-full absolute top-32 left-1/2 -translate-x-1/2 -z-0"></div>

                             {/* Actions from Joker */}
                             <div className="z-10 w-full space-y-4">
                                <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg text-center text-xs text-slate-300 shadow-xl">
                                    Creates Card & Preview
                                </div>
                                <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg text-center text-xs text-slate-300 shadow-xl">
                                    Sends Files + Guides
                                </div>
                                <div className="bg-orange-900/20 border border-orange-500/30 p-3 rounded-lg text-center text-xs text-orange-200 shadow-xl">
                                    Prints Starterpacks<br/>
                                    <span className="text-[9px] opacity-60">(Paid by Joker as free treat)</span>
                                </div>
                             </div>
                        </div>

                        {/* COLUMN 3: SHARER / CREATOR (Blue) */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-blue-950/40 border-2 border-blue-600/50 p-4 rounded-2xl text-center shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest">Sharer</h3>
                                <p className="text-xs text-blue-200/70 mt-1 font-mono">"Has their own cards"</p>
                            </div>

                            {/* Creation Flow */}
                            <div className="flex flex-col gap-4 relative border-l-2 border-blue-800/50 pl-4 ml-6">
                                {/* Step 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[25px] top-3 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900"></div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-blue-500/30">
                                        <p className="text-sm font-bold text-blue-200 mb-1">1. Use This App</p>
                                        <p className="text-xs text-slate-400">Download form / Generate data</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[25px] top-3 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900"></div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-blue-500/30">
                                        <p className="text-sm font-bold text-blue-200 mb-1">2. Send Info + Pic</p>
                                        <p className="text-xs text-slate-400">To Joker for final creation</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className="absolute -left-[25px] top-3 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-900"></div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-blue-500/30">
                                        <p className="text-sm font-bold text-blue-200 mb-1">3. Receive Files</p>
                                        <p className="text-xs text-slate-400">Ready for printing</p>
                                    </div>
                                </div>
                            </div>

                            {/* Printing Section */}
                            <div className="mt-4 pt-4 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Printer size={16} /> Printing
                                </h4>
                                
                                <div className="space-y-3">
                                    <div className="bg-orange-950/30 p-3 rounded-lg border border-orange-500/20 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-orange-500" />
                                            <span className="text-sm font-bold text-orange-200">EU Pups</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-300">Order & Pay Own</p>
                                            <p className="text-[10px] text-slate-500">meinspiel.de</p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-950/30 p-3 rounded-lg border border-orange-500/20 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Globe size={16} className="text-orange-500" />
                                            <span className="text-sm font-bold text-orange-200">Non-EU</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-300">Order via Joker</p>
                                            <p className="text-[10px] text-slate-500">Pay Sharer → Forward</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>

      </div>
    </div>
  );
};

export default GameGuideModal;
