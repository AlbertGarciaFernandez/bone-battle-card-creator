'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
    {
        question: "How long does it take to get my card?",
        answer: "Cards are usually processed within a few days depending on the volume of requests. Joker will confirm with you via DM once your card is added to the collection files."
    },
    {
        question: "Can I use a custom image?",
        answer: "Yes! You can upload any photo you have the rights to. Just make sure the file is not too heavy (stay under 3MB) to avoid submission issues."
    },
    {
        question: "Why do I need to send a Verification DM?",
        answer: "To ensure that the person requesting the card is the actual owner of the persona/images. This prevents people from submitting troll cards or using other people's images without permission."
    },
    {
        question: "Can I change my stats later?",
        answer: "Once a card is finalized and published, changes are generally not allowed unless there's an error. Make sure you review your preview carefully before submitting!"
    },
    {
        question: "What happens if the card screenshot fails on iOS?",
        answer: "iOS submissions are supported, but screenshot capture can sometimes fail. If that happens, take a manual screenshot of your card preview and send it to Joker via Instagram or Telegram as instructed."
    },
    {
        question: "What if my submission fails or the upload is too large?",
        answer: "The app checks image size and file limits before sending. If submission fails, try a smaller photo, check your connection, and follow the on-screen error message for the next step."
    },
    {
        question: "How do the 'Dog Tricks' work?",
        answer: "If your gear and kinks total score is under 50 bones, you can select 'Dog Tricks' to boost your score up to the 50 minimum required."
    },
    {
        question: "What can I do with my card once it's approved?",
        answer: "Once your card is in the collection, you can print it to hold in real life, share it on social media to show off your battle persona, or start collecting other players' cards to build your deck and trade with friends!"
    }
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
                                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
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
        </div>
    );
}
