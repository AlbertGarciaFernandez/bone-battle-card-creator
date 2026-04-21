'use client';

import React from 'react';
import {
    X, Instagram, Loader2, CheckCircle, AlertCircle, Send, MessageCircle, ShieldAlert
} from 'lucide-react';

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactPlatform?: 'instagram' | 'telegram';
    telegramHandle?: string;
    submitStatus: 'idle' | 'sending' | 'success' | 'error';
    sendError: string | null;
    isSending: boolean;
    isSendDisabled: boolean;
    onSubmit: () => void;
    onClearError: () => void;
    onContinue?: () => void;
}

export default function SendModal({
    isOpen, onClose, contactPlatform = 'instagram', telegramHandle,
    submitStatus, sendError, isSending, isSendDisabled, onSubmit, onClearError, onContinue
}: SendModalProps) {
    const isTelegram = contactPlatform === 'telegram';
    const tgHandle = (telegramHandle || '').replace(/^@/, '');
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
                        <p className="text-sm text-slate-400">Read this carefully before submitting your card.</p>
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
                <div className="p-6 space-y-6">

                    {/* Socials */}
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

                    {/* What's Next */}
                    {submitStatus === 'idle' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-blue-200">
                                <CheckCircle size={18} />
                                <h3 className="font-bold uppercase text-sm tracking-wider">{"What's Next?"}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                                    <p className="text-xs text-slate-300 mb-1 font-bold">1. Submit Request</p>
                                    <p className="text-xs text-slate-400">Click &quot;Send Request&quot; below. The app will capture your card and send the data securely.</p>
                                </div>
                                <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-700/40">
                                    <p className="text-xs text-amber-300 mb-1 font-bold">2. Verification DM ⚠️</p>
                                    <p className="text-xs text-amber-200/80">After it sends successfully, with your screenshot you will be asked to DM Joker to verify your identity. This prevents spam!</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                <MessageCircle size={14} />
                                <span>Any suggestions? Contact <a href="https://instagram.com/pup.hunter071" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white underline">Hunter</a>.</span>
                            </div>
                        </div>
                    )}

                    {submitStatus === 'sending' && (
                        <div className="flex flex-col items-center justify-center p-8 bg-blue-900/10 rounded-xl border border-blue-500/30 animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-blue-200 font-bold">Capturing card and sending request...</p>
                            <p className="text-blue-400/60 text-xs mt-1">This might take a few seconds.</p>
                        </div>
                    )}

                    {submitStatus === 'success' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center justify-center p-6 bg-green-900/10 rounded-xl border border-green-500/30">
                                <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                                <p className="text-green-200 font-bold text-center uppercase tracking-wider text-xl">Form Submitted!</p>
                                <p className="text-green-400/80 text-sm mt-1 text-center">Your card data has been sent securely.</p>
                            </div>

                            {/* ── VERIFICATION WARNING — high visibility ── */}
                            <div className="relative rounded-xl border-2 border-amber-500 bg-amber-950/40 p-5 shadow-[0_0_24px_rgba(245,158,11,0.2)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400 shrink-0">
                                        <ShieldAlert size={22} />
                                    </div>
                                    <p className="font-bold text-amber-300 text-lg uppercase tracking-wide">Verification Required</p>
                                </div>

                                {isTelegram ? (
                                    <>
                                        <p className="text-amber-100 text-base leading-relaxed mb-4">
                                            Now you <span className="font-bold text-white">MUST</span> message{' '}
                                            <a
                                                href="https://t.me/just_joker_jx"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-sky-300 underline underline-offset-2 hover:text-white transition-colors"
                                            >
                                                @just_joker_jx
                                            </a>{' '}
                                            on Telegram to confirm that <span className="font-bold text-white">this is really your request, for your own card</span>.
                                            Requests without verification will NOT be processed.
                                        </p>
                                        <a
                                            href={`https://t.me/just_joker_jx${tgHandle ? `?start=${tgHandle}` : ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base px-5 py-4 rounded-lg transition-colors shadow-lg"
                                        >
                                            ✈ Message @just_joker_jx on Telegram
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-amber-100 text-base leading-relaxed mb-4">
                                            Now you <span className="font-bold text-white">MUST</span> send a DM to{' '}
                                            <a
                                                href="https://instagram.com/joker.pup.jx"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-amber-300 underline underline-offset-2 hover:text-white transition-colors"
                                            >
                                                @joker.pup.jx
                                            </a>{' '}
                                            on Instagram with the screenshot of your card to confirm that <span className="font-bold text-white">this is really your request, for your own card</span>.
                                            Requests without verification will NOT be processed.
                                        </p>
                                        <a
                                            href="https://ig.me/m/joker.pup.jx"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base px-5 py-4 rounded-lg transition-colors shadow-lg animate-pulse"
                                        >
                                            <Instagram size={20} />
                                            DM @joker.pup.jx on Instagram
                                        </a>
                                    </>
                                )}
                            </div>
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
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
                    >
                        {submitStatus === 'success' ? 'Close' : 'Cancel'}
                    </button>
                    {submitStatus === 'success' ? (
                        <button
                            type="button"
                            onClick={onContinue || onClose}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 px-6 py-2 rounded-lg font-bold shadow-lg transition-all"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={isSendDisabled}
                            onClick={onSubmit}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                        >
                            {isSending ? (
                                <><Loader2 size={16} className="animate-spin" />Sending...</>
                            ) : (
                                <><Send size={16} />Send Request</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
