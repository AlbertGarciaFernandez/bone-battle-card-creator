'use client';

import React from 'react';
import NextImage from 'next/image';
import { Download, FileText, Send } from 'lucide-react';

interface AppHeaderProps {
    canSend: boolean;
    onSend: () => void;
    onExportTXT: () => void;
    onExportJSON: () => void;
}

export default function AppHeader({ canSend, onSend, onExportTXT, onExportJSON }: AppHeaderProps) {
    return (
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <NextImage
                        src="/bb_logo_t.png"
                        alt="Bone Battle Logo"
                        width={48}
                        height={48}
                        className="object-contain drop-shadow-lg"
                    />
                    <NextImage
                        src="/bb_logotext_t.png"
                        alt="Bone Battle"
                        width={160}
                        height={32}
                        className="h-8 w-auto object-contain drop-shadow-md"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onSend}
                        disabled={!canSend}
                        className={`hidden sm:flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg border transition-colors shadow-lg ${
                            canSend
                                ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 cursor-pointer animate-pulse'
                                : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                        title={canSend ? 'Send to Albert' : 'Total bones must be 50–70 (or select Dog Tricks to balance)'}
                    >
                        <Send size={16} />
                        Send
                    </button>
                    <div className="w-px h-8 bg-slate-800 mx-1 hidden sm:block" />
                    <button
                        onClick={onExportTXT}
                        className="hidden sm:flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg border border-green-600 transition-colors shadow-lg"
                        title="Export for Adobe Photoshop Variables"
                    >
                        <FileText size={16} />
                        TXT
                    </button>
                    <button
                        onClick={onExportJSON}
                        className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm px-4 py-2 rounded-lg border border-slate-700 transition-colors"
                    >
                        <Download size={16} />
                        JSON
                    </button>
                </div>
            </div>

            {/* Mobile Action Bar */}
            <div className="sm:hidden border-t border-slate-800 bg-slate-900 p-2 flex justify-around">
                <button
                    onClick={onSend}
                    disabled={!canSend}
                    className={`flex-1 flex items-center justify-center gap-2 text-white text-sm px-4 py-2 rounded-lg border ${
                        canSend ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700 opacity-50'
                    }`}
                >
                    <Send size={16} /> Send
                </button>
            </div>
        </header>
    );
}
