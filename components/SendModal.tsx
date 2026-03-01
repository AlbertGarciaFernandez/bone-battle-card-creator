'use client';

import React from 'react';
import {
    X, Instagram, Loader2, CheckCircle, AlertCircle, Send, MessageCircle
} from 'lucide-react';

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsletter: boolean;
    onNewsletterChange: (v: boolean) => void;
    submitStatus: 'idle' | 'sending' | 'success' | 'error';
    sendError: string | null;
    isSending: boolean;
    isSendDisabled: boolean;
    onSubmit: () => void;
    onClearError: () => void;
}

export default function SendModal({
    isOpen, onClose, newsletter, onNewsletterChange,
    submitStatus, sendError, isSending, isSendDisabled, onSubmit, onClearError,
}: SendModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="send-modal-title"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                    <div>
                        <h2 id="send-modal-title" className="text-xl font-bold text-white font-display">Before You Send...</h2>
                        <p className="text-sm text-slate-400">Join the pack and support the project!</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    {/* Socials */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-600/20 p-2 rounded-lg text-purple-400">
                                    <Instagram size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-white">Follow us!</p>
                                    <p className="text-slate-400 text-xs">Stay updated on new cards &amp; events.</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <a href="https://instagram.com/joker.pup.jx" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@joker.pup.jx</a>
                                <a href="https://instagram.com/bonebattlecards" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@bonebattlecards</a>
                                <a href="https://instagram.com/pup.hunter071" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@pup.hunter071</a>
                            </div>
                        </div>

                        <label
                            aria-label="Subscribe to Newsletter"
                            className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={newsletter}
                                onChange={(e) => onNewsletterChange(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className="block text-sm font-bold text-white">Subscribe to Newsletter</span>
                                <span className="block text-xs text-slate-400">Get the latest news about Bone Battle and related projects.</span>
                            </div>
                        </label>
                    </div>

                    {/* What's Next */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-200">
                            <CheckCircle size={18} />
                            <h3 className="font-bold uppercase text-sm tracking-wider">{"What's Next?"}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                                <p className="text-xs text-slate-300 mb-1 font-bold">1. Screenshot</p>
                                <p className="text-xs text-slate-400">Did you take a screenshot of your card? You will need it.</p>
                            </div>
                            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                                <p className="text-xs text-slate-300 mb-1 font-bold">2. Confirm</p>
                                <p className="text-xs text-slate-400">Confirm with Joker on Instagram that you have sent your request along with the screenshot.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                            <MessageCircle size={14} />
                            <span>Any suggestions to improve? Contact <a href="https://instagram.com/pup.hunter071" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white underline">Hunter</a>.</span>
                        </div>
                    </div>

                    {submitStatus === 'sending' && (
                        <div className="flex flex-col items-center justify-center p-8 bg-blue-900/10 rounded-xl border border-blue-500/30 animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-blue-200 font-bold">Capturing card and sending request...</p>
                            <p className="text-blue-400/60 text-xs mt-1">This might take a few seconds.</p>
                        </div>
                    )}

                    {submitStatus === 'success' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center p-8 bg-green-900/10 rounded-xl border border-green-500/30">
                                <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
                                <p className="text-green-200 font-bold text-center uppercase tracking-wider">Form Submitted Successfully!</p>
                                <p className="text-green-400/60 text-xs mt-1 text-center">Your files have been downloaded as a backup.</p>
                            </div>
                            <p className="text-center text-slate-400 text-sm animate-pulse">Closing this window and opening support options...</p>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="flex flex-col items-center justify-center p-8 bg-red-900/10 rounded-xl border border-red-500/30">
                            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                            <p className="text-red-200 font-bold text-center">Error sending request</p>
                            <p className="text-red-400 text-xs mt-2 text-center bg-red-950/50 p-2 rounded">{sendError}</p>
                            <button
                                type="button"
                                onClick={onClearError}
                                className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <div className="text-center pt-4 border-t border-slate-800">
                        <p className="text-lg font-display font-bold text-bone-100">
                            {'"Welcome to Bone Battle Collection. Ready to fight?"'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 sticky bottom-0 rounded-b-2xl">
                    <button
                        type="button"
                        disabled={isSending}
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isSendDisabled}
                        onClick={onSubmit}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                            submitStatus === 'success'
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                        }`}
                    >
                        {isSending ? (
                            <><Loader2 size={16} className="animate-spin" />Sending...</>
                        ) : submitStatus === 'success' ? (
                            <><CheckCircle size={16} />Sent!</>
                        ) : (
                            <><Send size={16} />Send Request</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
