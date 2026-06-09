'use client';

import React from 'react';
import { Gift, Globe, Heart, CheckCircle, Mail, Sparkles } from 'lucide-react';

interface SupportSectionProps {
    onDeveloperSupport: () => void;
}

export default function SupportSection({ onDeveloperSupport }: SupportSectionProps) {
    return (
        <div className="mt-16 max-w-4xl mx-auto py-12 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
                    <Gift size={28} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">Support Bone Battle</h2>
            </div>

            <div className="text-sm text-slate-300 space-y-6 leading-relaxed bg-slate-950/50 p-8 rounded-xl border border-slate-800">
                <p className="font-medium text-lg">
                    {"We're doing all of this because we love to and thus won't charge anything (you should cover shipping costs and prints of your own cards though)."}
                </p>
                <p className="text-slate-400 italic text-base">
                    {"If you want to support the creators and developers, here are some ways you can help:"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {/* Option A */}
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-orange-950/20 border border-orange-500/20 hover:border-orange-500/40 transition-all">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                <Heart size={18} className="text-orange-400" />
                            </div>
                            <span className="text-orange-400 font-bold">BoneBattleCards (The Creator)</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">Send a gift card or physical gift</p>
                        <div className="bg-black/30 p-2 rounded">
                            <p className="text-[11px] text-slate-400">Email: <span className="text-orange-300 font-mono font-bold">bonebattlecards@gmail.com</span></p>
                        </div>
                        <a 
                            href="https://amzn.eu/d/70zAVcn" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-orange-600 hover:bg-orange-500 px-3 py-2 rounded-lg text-white font-bold text-center no-underline transition-all"
                        >
                            Amazon.de Wishlist
                        </a>
                    </div>

                    {/* Option B */}
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-slate-800/40 border border-slate-700 hover:border-slate-500/40 transition-all">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-700/40 p-2 rounded-lg">
                                <Gift size={18} className="text-slate-400" />
                            </div>
                            <span className="text-slate-200 font-bold">BoneBattleCards' Wishlist</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">Browse items and send gifts directly</p>
                        <a 
                            href="https://throne.com/joker_jx" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-blue-400 font-bold text-center no-underline transition-all"
                        >
                            Visit Throne List
                        </a>
                    </div>

                    {/* Option C */}
                    <div className="relative group overflow-hidden p-5 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-lg shadow-blue-900/10 hover:border-blue-400/50 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles size={50} className="text-blue-400" />
                        </div>
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Globe size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-blue-300 font-bold text-sm block">The Developer</span>
                                    <h4 className="text-blue-100 font-black text-sm">CodeHunter Lab</h4>
                                </div>
                            </div>
                            <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                                Support development to keep features updated and free!
                            </p>
                            <button
                                type="button"
                                onClick={onDeveloperSupport}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                            >
                                <Heart size={14} fill="currentColor" />
                                Support Lab
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm italic text-slate-400 mt-8 border-t border-slate-800 pt-6">
                    {"Feel free to support any way you want, or just enjoy the cards and game for free. We're happy when you are! ^^"}
                </p>
            </div>
        </div>
    );
}
