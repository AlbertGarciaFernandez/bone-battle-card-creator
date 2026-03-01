'use client';

import React from 'react';
import { FileText, Globe, Heart, Instagram, BookOpen } from 'lucide-react';

interface AppFooterProps {
    onOpenGuide: (tab: 'basics' | 'diagram') => void;
}

export default function AppFooter({ onOpenGuide }: AppFooterProps) {
    return (
        <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-800 mt-12 bg-slate-950">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Creator */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2 mb-2 text-bone-400">
                        <Heart size={16} className="fill-current" />
                        <span className="text-sm font-bold uppercase tracking-wider">Created By</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a href="https://instagram.com/joker.pup.jx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-bone-200 transition-colors group">
                            <Instagram size={16} className="text-slate-600 group-hover:text-bone-400 transition-colors" />
                            <span className="font-medium">joker.pup.jx</span>
                        </a>
                        <a href="https://instagram.com/bonebattlecards" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-bone-200 transition-colors group">
                            <Instagram size={16} className="text-slate-600 group-hover:text-bone-400 transition-colors" />
                            <span className="font-medium">bonebattlecards</span>
                        </a>
                    </div>
                </div>

                {/* Game Guides */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-2 text-green-400">
                        <BookOpen size={16} />
                        <span className="text-sm font-bold uppercase tracking-wider">Game Guides</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => onOpenGuide('basics')} className="flex items-center gap-2 text-slate-500 hover:text-green-200 transition-colors group">
                            <span className="font-medium">What is Bone Battle?</span>
                            <FileText size={14} className="text-slate-600 group-hover:text-green-400 transition-colors" />
                        </button>
                        <button onClick={() => onOpenGuide('diagram')} className="flex items-center gap-2 text-slate-500 hover:text-green-200 transition-colors group">
                            <span className="font-medium">Print, Share, Collect</span>
                            <FileText size={14} className="text-slate-600 group-hover:text-green-400 transition-colors" />
                        </button>
                        <a href="https://linktr.ee/bonebattle" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group mt-1">
                            <span className="font-bold text-xs uppercase tracking-tighter">Bone Battle Linktree</span>
                            <Globe size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Developer */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="flex items-center gap-2 mb-3 text-blue-400">
                        <span className="text-sm font-bold uppercase tracking-wider">Developed By</span>
                        <Globe size={16} />
                    </div>
                    <div className="flex flex-col gap-3 items-center md:items-end">
                        <a href="https://instagram.com/pup.hunter071" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-bone-200 transition-colors group">
                            <span className="font-medium">pup.hunter071</span>
                            <Instagram size={16} className="text-slate-600 group-hover:text-bone-400 transition-colors" />
                        </a>
                        <a href="https://www.codehunterlab.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center md:items-end group">
                            <span className="text-sm font-display font-black text-slate-400 group-hover:text-blue-400 transition-colors tracking-widest uppercase">CODEHUNTER LAB</span>
                            <div className="flex items-center gap-1 text-slate-600 group-hover:text-blue-500/60 transition-colors">
                                <span className="text-[10px] font-mono">www.codehunterlab.com</span>
                                <Globe size={10} />
                            </div>
                        </a>
                    </div>
                </div>

            </div>
            <div className="mt-10 pt-6 border-t border-slate-900 text-center">
                <p className="text-xs text-slate-700 uppercase tracking-widest font-semibold">
                    Support the pack &bull; Follow for updates
                </p>
            </div>
        </footer>
    );
}
