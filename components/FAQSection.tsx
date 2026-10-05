'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQ_ITEMS = [
    {
        question: "Can I use a custom image?",
        answer: "Yes! You can upload any photo you have the rights to. Photos up to 20MB are accepted and optimized automatically before sending."
    },
    {
        question: "What happens if the card capture fails on iOS?",
        answer: "Try submitting again. If the online form continues to have problems, use the website's help options rather than contacting an individual card creator."
    },
    {
        question: "What if my submission fails or the upload is too large?",
        answer: "The app checks image size and optimizes large photos before sending. If submission still fails, try another photo, check your connection, and follow the on-screen error message for the next step."
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="mt-16 max-w-4xl mx-auto py-8 border-t border-slate-800">
            <div className="flex items-center justify-center gap-3 mb-8">
                <HelpCircle className="text-blue-500" size={28} />
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div 
                            key={index} 
                            className={`border ${isOpen ? 'border-blue-500 bg-blue-950/20' : 'border-slate-800 bg-slate-900/50'} rounded-xl transition-all overflow-hidden`}
                        >
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                            >
                                <span className={`font-bold ${isOpen ? 'text-blue-200' : 'text-slate-200'}`}>{item.question}</span>
                                {isOpen ? (
                                    <ChevronUp className="text-blue-400 shrink-0 ml-4" size={20} />
                                ) : (
                                    <ChevronDown className="text-slate-500 shrink-0 ml-4" size={20} />
                                )}
                            </button>
                            {isOpen && (
                                <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-blue-900/30">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 text-center">
                <Link href="https://www.bonebattle.me/faqs" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4">
                    For card and game FAQs, visit BoneBattle.me
                </Link>
            </div>
        </div>
    );
}
