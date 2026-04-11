'use client';

import React from 'react';
import { X, Gift, Globe, Heart, CheckCircle, Mail, Sparkles } from 'lucide-react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeveloperSupport: () => void;
}

export default function SupportModal({ isOpen, onClose, onDeveloperSupport }: SupportModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm w-full h-full cursor-default"
                onClick={onClose}
            />
            <div
                className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                role="dialog"
                aria-modal="true"
                aria-labelledby="support-modal-title"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                            <Gift size={24} />
                        </div>
                        <div>
                            <h2 id="support-modal-title" className="text-xl font-black text-white uppercase tracking-tight">Support Bone Battle</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">How to help us grow</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3 mb-2">
                        <CheckCircle className="text-green-500 shrink-0" size={20} />
                        <p className="text-green-200 text-sm font-medium">Your card request has been sent! Now, consider helping the creators:</p>
                    </div>

                    <div className="text-sm text-slate-300 space-y-4 leading-relaxed bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                        <p className="font-medium">
                            {"I'm doing all of this because I love to and thus won't charge anything (you should cover shipping costs and prints of your own cards though)."}
                        </p>
                        <p className="text-slate-400 italic">
                            {"BUT as many pups are asking about how to support all of this… here we go:"}
                        </p>

                        <ul className="space-y-4 mt-2">
                            {/* Option A */}
                            <li className="flex flex-col gap-2 p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 group hover:border-orange-500/40 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-orange-500 font-bold">A) Joker (The Creator)</span>
                                    <a href="https://amzn.eu/d/70zAVcn" target="_blank" rel="noopener noreferrer" className="text-xs bg-orange-600 hover:bg-orange-500 px-3 py-1.5 rounded-lg text-white font-bold no-underline transition-all">Amazon.de Card</a>
                                </div>
                                <div className="bg-black/20 p-2 rounded items-center flex justify-between">
                                    <p className="text-[10px] text-slate-400">Send to: <span className="text-white font-mono select-all">pup.joker.jx@gmail.com</span></p>
                                    <Mail size={12} className="text-slate-500" />
                                </div>
                            </li>

                            {/* Option B */}
                            <li className="flex flex-col gap-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700 group hover:border-slate-500/40 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-200 font-bold">{"B) Joker's Wishlist"}</span>
                                    <a href="https://throne.com/joker_jx" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-blue-400 font-bold no-underline transition-all">Throne List</a>
                                </div>
                            </li>

                            {/* Option C */}
                            <li className="relative group overflow-hidden p-5 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-lg shadow-blue-900/10 hover:border-blue-400/50 transition-all">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles size={50} className="text-blue-400" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <Globe size={18} className="text-blue-400" />
                                            </div>
                                            <div>
                                                <span className="text-blue-100 font-black uppercase tracking-wider text-[10px] block">C) The Developer</span>
                                                <h4 className="text-bone-100 font-bold text-base">CodeHunter Lab</h4>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onDeveloperSupport}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                                        >
                                            <Heart size={14} fill="currentColor" />
                                            Support Lab
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                                        Support our developer so we can mantain updated and release new features for free! Every bit of support helps us keep the project alive and growing, and we truly appreciate it! ^^
                                    </p>
                                </div>
                            </li>
                        </ul>

                        <p className="text-center text-[11px] italic text-slate-500 mt-6 border-t border-slate-800 pt-4">
                            {"Feel free to support any way you want, or just enjoy the cards and game for free. I'm happy when you are! ^^"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        Close and continue
                    </button>
                </div>
            </div>
        </div>
    );
}
