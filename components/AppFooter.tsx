'use client';

import React from 'react';
import { Instagram, Globe, Sparkles } from 'lucide-react';


interface AppFooterProps {
    onOpenGuide: (tab: 'basics' | 'diagram') => void;
}

export default function AppFooter({ onOpenGuide }: AppFooterProps) {
    return (
        <>
            {/* Spacer so page content never gets hidden behind the fixed footer */}
            <div className="h-16" />

            <footer className="fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-slate-950/90 backdrop-blur-xl border-t border-slate-700/50">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                        {/* Left: Created By */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-bone-300 hidden sm:block">Created By</span>
                            <a
                                href="https://instagram.com/joker.pup.jx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group hidden sm:flex items-center gap-1.5 text-bone-400 hover:text-bone-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100" />
                                <span className="text-[11px] font-semibold">joker.pup.jx</span>
                            </a>
                            <a
                                href="https://instagram.com/bonebattlecards"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-bone-400 hover:text-bone-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100" />
                                <span className="text-[11px] font-semibold">bonebattlecards</span>
                            </a>
                        </div>

                        {/* Center: Guides & Linktree */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onOpenGuide('basics')}
                                className="text-[11px] font-semibold text-green-400 hover:text-green-200 transition-colors hidden sm:block"
                            >
                                What is Bone Battle?
                            </button>
                            <button
                                onClick={() => onOpenGuide('diagram')}
                                className="text-[11px] font-semibold text-green-400 hover:text-green-200 transition-colors hidden sm:block"
                            >
                                Print, Share, Collect
                            </button>
                            <a
                                href="https://linktr.ee/bonebattle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1 text-blue-400 hover:text-blue-200 transition-colors"
                            >
                                <Globe size={13} />
                                <span className="text-[11px] font-semibold">Linktree</span>
                            </a>
                        </div>

                        {/* Right: Developed By */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.codehunterlab.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 transition-colors"
                            >
                                <Sparkles size={13} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">CODEHUNTER LAB</span>
                            </a>
                            <a
                                href="https://instagram.com/pup.hunter071"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group hidden sm:flex items-center gap-1.5 text-blue-300 hover:text-cyan-200 transition-colors"
                            >
                                <Instagram size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[11px] font-semibold">pup.hunter071</span>
                            </a>
                            <span className="text-[10px] text-slate-500 hidden sm:block">Support the pack</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
