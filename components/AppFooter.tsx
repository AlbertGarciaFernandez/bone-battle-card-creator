'use client';

import React from 'react';
import { Instagram, Globe, Sparkles } from 'lucide-react';


export default function AppFooter() {
    return (
        <>
            {/* Spacer so page content never gets hidden behind the fixed footer */}
            <div className="h-16" />

            <footer className="fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-slate-950/90 backdrop-blur-xl border-t border-slate-700/50">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Editor preview: CodeHunter Lab */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-bone-300">Editor Preview</span>
                            <span className="text-[10px] text-slate-400">Created by</span>
                            <a
                                href="https://www.codehunterlab.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 transition-colors"
                            >
                                <Sparkles size={13} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">CodeHunter Lab</span>
                            </a>
                            <a
                                href="https://instagram.com/pup.hunter071"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-blue-300 hover:text-cyan-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[11px] font-semibold">Hunter · pup.hunter071</span>
                            </a>
                        </div>

                        {/* Linktree */}
                        <a
                            href="https://linktr.ee/bonebattle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-1.5 text-blue-400 hover:text-blue-200 transition-colors"
                        >
                            <Globe size={13} />
                            <span className="text-[11px] font-semibold">Linktree</span>
                        </a>

                        {/* BoneBattleCards and Joker Instagram */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <a
                                href="https://instagram.com/bonebattlecards"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-bone-400 hover:text-bone-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">BONEBATTLECARDS</span>
                            </a>
                            <span className="text-[10px] text-slate-400">by</span>
                            <a
                                href="https://instagram.com/joker.pup.jx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-bone-400 hover:text-bone-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100" />
                                <span className="text-[11px] font-semibold">Joker</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
