'use client';

import React, { useState } from 'react';
import CardPreview from '../components/CardPreview';
import CardForm from '../components/CardForm';
import GameGuideModal from '../components/GameGuideModal';
import { CardData, HoodColor, GEAR_CATEGORIES, KINKS_CATEGORIES } from '../types';
import { generateCardImage } from '../services/geminiService';
import {
    PawPrint, Download, FileText, Send, Instagram, Heart, Globe,
    Code, Camera, Gift, X, CheckCircle, Mail, MessageCircle, BookOpen,
    Loader2, AlertCircle, Sparkles
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';

// Constants
const MIN_BONES = 40;
const MAX_BONES = 70;

const GEAR_KEYS_ORDERED = [
    { label: "Rubber", prefix: "rubber" },
    { label: "Leather", prefix: "leather" },
    { label: "Sox/Sneaker", prefix: "sneaker" },
    { label: "Jocks/Undies", prefix: "jocks" },
    { label: "Furry", prefix: "furry" },
    { label: "MX/Biker", prefix: "mx" },
    { label: "Sportswear", prefix: "sportswear" },
    { label: "Tactical/Unif.", prefix: "tactical" }
] as const;

const KINKS_KEYS_ORDERED = [
    { label: "Outdoor/Dares", prefix: "outdoor" },
    { label: "Sniffing", prefix: "sniffing" },
    { label: "Edging", prefix: "edging" },
    { label: "Fisting", prefix: "fisting" },
    { label: "ABDL", prefix: "abdl" },
    { label: "Toys", prefix: "toys" },
    { label: "Cuckolding", prefix: "cuckolding" },
    { label: "Power Play", prefix: "power" },
    { label: "Chastity", prefix: "chastity" },
    { label: "BDSM", prefix: "bdsm" },
    { label: "Verbal", prefix: "verbal" },
    { label: "Dirty", prefix: "dirty" }
] as const;

// Helper functions
const downloadFile = (content: string | Blob, filename: string, mimeType: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const sanitizeForExport = (str: string | undefined): string => {
    return String(str || '').replace(/[\t\n\r]/g, " ").trim();
};

const calculateTotalBones = (gear: Record<string, number>, kinks: Record<string, number>): number => {
    const gearSum = Object.values(gear).reduce((sum, v) => sum + v, 0);
    const kinksSum = Object.values(kinks).reduce((sum, v) => sum + v, 0);
    return gearSum + kinksSum;
};

const INITIAL_CARD: CardData = {
    name: "",
    hoodColor: HoodColor.RED,
    imageUrl: "",
    birthdate: "",
    height: "",
    shoeSize: "",
    socialLink: "",
    country: "",
    consent: false,
    decisionConsent: false,
    namePosition: 'left-top',
    statsPosition: 'right-middle',
    dogTricksPermission: false,
    dogTricks: "",
    imageZoom: 1,
    imagePosition: { x: 0, y: 0 },
    gear: Object.fromEntries(GEAR_CATEGORIES.map(c => [c, 0])),
    kinks: Object.fromEntries(KINKS_CATEGORIES.map(c => [c, 0]))
};

const App: React.FC = () => {
    const [card, setCard] = useState<CardData>(INITIAL_CARD);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [showSendModal, setShowSendModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [newsletterSubscribe, setNewsletterSubscribe] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [sendError, setSendError] = useState<string | null>(null);

    // Form Validation
    const isCardValid = () => {
        const requiredFields = [
            card.name,
            card.imageUrl,
            card.birthdate,
            card.height,
            card.shoeSize,
            card.socialLink,
            card.country
        ];

        const hasEmptyFields = requiredFields.some(field => !field || field.trim() === "");
        const isPawsdayValid = /^\d{4}\.\d{2}$/.test(card.birthdate);
        const hasConsented = card.consent && card.decisionConsent;
        const hasTotalBonesInRange = calculateTotalBones(card.gear, card.kinks) >= 50 && calculateTotalBones(card.gear, card.kinks) <= 70;

        return !hasEmptyFields && isPawsdayValid && hasConsented && hasTotalBonesInRange;
    };

    const isSendDisabled = isSending || submitStatus === 'success' || !isCardValid();

    // Game Guide State
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [guideInitialTab, setGuideInitialTab] = useState<'basics' | 'diagram'>('basics');

    const handleGenerateImageOnly = async () => {
        if (!card.name) return;
        setIsGeneratingImage(true);
        setError(null);
        try {
            const prompt = `${card.name}, ${card.hoodColor} hood human pup`;
            const imageBase64 = await generateCardImage(prompt, 'photo portrait, dramatic lighting, high quality');
            setCard(prev => ({ ...prev, imageUrl: imageBase64 }));
        } catch (err) {
            console.error(err);
            setError("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleExportJSON = () => {
        const jsonContent = JSON.stringify(card, null, 2);
        downloadFile(jsonContent, `${card.name || "card"}_data.json`, 'application/json;charset=utf-8');
    };

    const getPhotoshopTXTContent = () => {
        // Build headers for gear and kinks (5 columns each)
        const gearHeaders = GEAR_KEYS_ORDERED.flatMap(item =>
            Array.from({ length: 5 }, (_, i) => `${item.prefix}${i + 1}`)
        );
        const kinkHeaders = KINKS_KEYS_ORDERED.flatMap(item =>
            Array.from({ length: 5 }, (_, i) => `${item.prefix}${i + 1}`)
        );

        const baseHeaders = [
            "namev",
            "VariabledetextoAlturaM",
            "VariabledetextoAlturaImp",
            "VariabledetextoPieEU",
            "VariabledetextoPieUS",
            "Birthdate",
            "Social Link"
        ];

        // Parse height and shoe size
        const [heightM = "", heightImp = ""] = (card.height || "").split(" / ");
        const [shoeEU = "", shoeUS = ""] = (card.shoeSize || "").split(" / ");

        const baseValues = [
            sanitizeForExport(card.name),
            sanitizeForExport(heightM),
            sanitizeForExport(heightImp.replace(/"/g, '')),
            sanitizeForExport(shoeEU),
            sanitizeForExport(shoeUS),
            sanitizeForExport(card.birthdate),
            sanitizeForExport(card.socialLink)
        ];

        // Generate boolean values for gear/kinks (true if value matches column index)
        const gearValues = GEAR_KEYS_ORDERED.flatMap(item => {
            const value = card.gear[item.label] || 0;
            return Array.from({ length: 5 }, (_, i) => value === i + 1 ? "true" : "false");
        });

        const kinkValues = KINKS_KEYS_ORDERED.flatMap(item => {
            const value = card.kinks[item.label] || 0;
            return Array.from({ length: 5 }, (_, i) => value === i + 1 ? "true" : "false");
        });

        const allHeaders = [...baseHeaders, ...gearHeaders, ...kinkHeaders];
        const allValues = [...baseValues, ...gearValues, ...kinkValues];
        const fileContent = `${allHeaders.join('\t')}\n${allValues.join('\t')}`;

        return fileContent;
    };

    const handleExportPhotoshopTXT = () => {
        const fileContent = getPhotoshopTXTContent();
        downloadFile(fileContent, `${card.name || 'pup'}_ps_data.txt`, 'text/plain;charset=utf-8');
    };

    // Step 1: Trigger Modal
    const handleInitiateSend = () => {
        setShowSendModal(true);
    };

    // Step 2: Actually Send
    const handleFinalizeSend = async () => {
        setIsSending(true);
        setSubmitStatus('sending');
        setSendError(null);

        // Attempt downloads as backup (don't let failures block the send)
        try { handleExportPhotoshopTXT(); } catch (e) { console.warn('TXT download skipped:', e); }

        try {
            // 1. Try to capture the card as an image (may fail on mobile)
            let capturedCardImage: string | null = null;
            const node = document.getElementById('card-preview-container');

            if (node) {
                await new Promise(resolve => setTimeout(resolve, 100));
                try {
                    capturedCardImage = await htmlToImage.toPng(node, {
                        quality: 0.95,
                        backgroundColor: '#000000',
                        cacheBust: false, // cacheBust breaks CORS for external images (flags) on mobile
                        style: {
                            borderRadius: '0',
                            margin: '0',
                        },
                    });

                    // Try to download the captured image (may not work on mobile)
                    try {
                        const link = document.createElement('a');
                        link.download = `${card.name.replace(/\s+/g, '_')}_final.png`;
                        link.href = capturedCardImage;
                        link.click();
                    } catch (e) { console.warn('Card image download skipped:', e); }
                } catch (e) {
                    console.warn('Card capture failed (common on mobile):', e);
                }
            }

            // 2. Optimize images for the API payload
            const shrinkImage = async (base64: string, maxWidth = 1200): Promise<string> => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = base64;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return resolve(base64);

                        const ratio = img.width / img.height;
                        const width = Math.min(img.width, maxWidth);
                        const height = width / ratio;

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    };
                    img.onerror = () => resolve(base64);
                });
            };

            const optimizedCardImage = capturedCardImage
                ? await shrinkImage(capturedCardImage, 1000)
                : null;

            const optimizedOriginal = card.imageUrl?.startsWith('data:')
                ? await shrinkImage(card.imageUrl, 1200)
                : card.imageUrl || null;

            // At least one image is needed
            if (!optimizedCardImage && !optimizedOriginal) {
                throw new Error('Could not process any images. Please try again or use a different browser.');
            }

            // 3. Send to our API (exclude imageUrl from card to avoid sending the full unoptimized image)
            const { imageUrl: _excludedImage, ...cardWithoutImage } = card;
            const response = await fetch('/api/send-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card: {
                        ...cardWithoutImage,
                        totalBones: calculateTotalBones(card.gear, card.kinks)
                    },
                    imageData: optimizedCardImage || optimizedOriginal,
                    cardText: getPhotoshopTXTContent(),
                    originalImage: optimizedOriginal,
                    newsletter: newsletterSubscribe
                }),
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error(`Server error (${response.status}). The request may be too large — try using a smaller image.`);
            }

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send card');
            }

            setSubmitStatus('success');

            // After 1.5 seconds, close send modal and open support modal
            setTimeout(() => {
                setShowSendModal(false);
                setShowSupportModal(true);
                setSubmitStatus('idle'); // Reset for next time
            }, 1500);

            setIsSending(false);

        } catch (err: any) {
            console.error('Send Error:', err);
            setSubmitStatus('error');
            setSendError(err.message || 'An unexpected error occurred. Please try from a desktop browser.');
            setIsSending(false);
        }
    };

    const openGameGuide = (tab: 'basics' | 'diagram') => {
        setGuideInitialTab(tab);
        setShowGuideModal(true);
    };

    const handleDeveloperSupport = async () => {
        const stripePriceId = "price_1SxT80QNT7knsC42AKh1AlAn";
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: stripePriceId,
                    metadata: {
                        pup_name: card.name,
                        social: card.socialLink
                    }
                }),
            });
            const { url, error } = await response.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;
        } catch (err) {
            console.error('Support redirect error:', err);
            // Updated to the user-provided official Stripe Payment Link
            window.open(`https://buy.stripe.com/00w28t5VP1D69IjdQcf3a01?client_reference_id=${stripePriceId}`, '_blank');
        }
    };

    const totalBones = React.useMemo(
        () => calculateTotalBones(card.gear, card.kinks),
        [card.gear, card.kinks]
    );

    // Validation: all required fields + bones in range + consent
    const canSend = isCardValid();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-8 relative">

            {/* Game Guide Modal */}
            <GameGuideModal
                isOpen={showGuideModal}
                onClose={() => setShowGuideModal(false)}
                initialTab={guideInitialTab}
            />

            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-bone-500 p-2 rounded-lg shadow-lg shadow-bone-500/20">
                            <PawPrint className="text-slate-900 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display text-bone-100 tracking-wide">BONE BATTLE <span className="text-bone-400">PREVIEW</span></h1>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Card Creator</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleInitiateSend}
                            disabled={!canSend}
                            className={`hidden sm:flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg border transition-colors shadow-lg ${canSend
                                ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 cursor-pointer animate-pulse'
                                : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                                }`}
                            title={canSend ? "Send to Albert" : "Total bones must be between 40 and 70"}
                        >
                            <Send size={16} />
                            Send
                        </button>

                        <div className="w-px h-8 bg-slate-800 mx-1 hidden sm:block"></div>

                        <button
                            onClick={handleExportPhotoshopTXT}
                            className="hidden sm:flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg border border-green-600 transition-colors shadow-lg"
                            title="Export for Adobe Photoshop Variables"
                        >
                            <FileText size={16} />
                            TXT
                        </button>
                        <button
                            onClick={handleExportJSON}
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
                        onClick={handleInitiateSend}
                        disabled={!canSend}
                        className={`flex-1 flex items-center justify-center gap-2 text-white text-sm px-4 py-2 rounded-lg border ${canSend ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700 opacity-50'
                            }`}
                    >
                        <Send size={16} /> Send
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* READY BANNER */}
                {canSend && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500 p-2 rounded-full text-slate-900 shadow-lg shadow-green-500/20">
                                <Camera size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-100">Card Ready for Battle!</h3>
                                <p className="text-sm text-green-200/80">
                                    Please <span className="font-bold text-white underline decoration-2">take a screenshot</span> of your card preview before sending.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleInitiateSend}
                            className="bg-white text-green-900 font-bold px-6 py-2 rounded-lg shadow hover:bg-green-50 transition-colors whitespace-nowrap"
                        >
                            Start Sending
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-6 xl:col-span-6 order-2 lg:order-1">
                        <CardForm
                            card={card}
                            setCard={setCard}
                            onGenerateImage={handleGenerateImageOnly}
                            isGeneratingImage={isGeneratingImage}
                        />
                    </div>

                    {/* Right Column: Preview */}
                    <div className="lg:col-span-6 xl:col-span-6 order-1 lg:order-2 flex flex-col items-center">
                        <div className="sticky top-28">
                            <div className="mb-4 flex justify-between w-[360px] items-end">
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Live Preview</span>
                                <span className="text-xs text-slate-600">
                                    {card.name ? 'Ready to Battle' : 'Drafting...'}
                                </span>
                            </div>

                            {/* The Card Component */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-bone-600 to-slate-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <CardPreview data={card} />
                            </div>

                            <div className="mt-8 max-w-md text-center">
                                <p className="text-slate-500 text-sm italic">
                                    "Unleash your inner pup."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer / Credits */}
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

                    {/* Resources / Guides */}
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-2 text-green-400">
                            <BookOpen size={16} />
                            <span className="text-sm font-bold uppercase tracking-wider">Game Guides</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => openGameGuide('basics')} className="flex items-center gap-2 text-slate-500 hover:text-green-200 transition-colors group">
                                <span className="font-medium">What is Bone Battle?</span>
                                <FileText size={14} className="text-slate-600 group-hover:text-green-400 transition-colors" />
                            </button>
                            <button onClick={() => openGameGuide('diagram')} className="flex items-center gap-2 text-slate-500 hover:text-green-200 transition-colors group">
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
                            <a
                                href="https://www.codehunterlab.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center md:items-end group"
                            >
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

            {/* SEND & SUPPORT MODAL */}
            {showSendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleFinalizeSend();
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white font-display">Before You Send...</h2>
                                <p className="text-sm text-slate-400">Join the pack and support the project!</p>
                            </div>
                            <button type="button" onClick={() => setShowSendModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-8">

                            {/* Socials & Newsletter */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-600/20 p-2 rounded-lg text-purple-400">
                                            <Instagram size={20} />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-white">Follow us!</p>
                                            <p className="text-slate-400 text-xs">Stay updated on new cards & events.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <a href="https://instagram.com/joker.pup.jx" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@joker.pup.jx</a>
                                        <a href="https://instagram.com/bonebattlecards" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@bonebattlecards</a>
                                        <a href="https://instagram.com/pup.hunter071" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">@pup.hunter071</a>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={newsletterSubscribe}
                                        onChange={(e) => setNewsletterSubscribe(e.target.checked)}
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
                                    <h3 className="font-bold uppercase text-sm tracking-wider">What's Next?</h3>
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
                                        onClick={() => setSubmitStatus('idle')}
                                        className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {/* Welcome Message */}
                            <div className="text-center pt-4 border-t border-slate-800">
                                <p className="text-lg font-display font-bold text-bone-100">
                                    "Welcome to Bone Battle Collection. Ready to fight?"
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 sticky bottom-0 rounded-b-2xl">
                            <button
                                type="button"
                                disabled={isSending}
                                onClick={() => setShowSendModal(false)}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSendDisabled}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${submitStatus === 'success'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                    }`}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : submitStatus === 'success' ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Sent!
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div >
            )}

            {/* Support Modal - Opens after successful submission */}
            {showSupportModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setShowSupportModal(false)}
                    />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                                    <Gift size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Support Bone Battle</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">How to help us grow</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSupportModal(false)}
                                className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3 mb-2">
                                <CheckCircle className="text-green-500 shrink-0" size={20} />
                                <p className="text-green-200 text-sm font-medium">Your card request has been sent! Now, consider helping the creators:</p>
                            </div>

                            <div className="text-sm text-slate-300 space-y-4 leading-relaxed bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                                <p className="font-medium">
                                    I’m doing all of this because I love to and thus won’t charge anything (you should cover shipping costs and prints of your own cards though).
                                </p>
                                <p className="text-slate-400 italic">
                                    BUT as many pups are asking about how to support all of this… here we go:
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
                                            <span className="text-slate-200 font-bold">B) Joker's Wishlist</span>
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
                                                    onClick={handleDeveloperSupport}
                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                                                >
                                                    <Heart size={14} fill="currentColor" />
                                                    Support Lab
                                                </button>
                                            </div>
                                            <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                                                Support our developer so we can release the <strong className="text-blue-100 underline decoration-blue-500/50">Collectible Card Album App</strong> even faster!
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                <p className="text-center text-[11px] italic text-slate-500 mt-6 border-t border-slate-800 pt-4">
                                    Feel free to support any way you want, or just enjoy the cards and game for free. I’m happy when you are! ^^
                                </p>
                            </div>

                            <button
                                onClick={() => setShowSupportModal(false)}
                                className="w-full py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                Close and continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default App;
