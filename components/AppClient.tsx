'use client';

import React, { useState, useReducer, useMemo } from 'react';
import CardPreview from './CardPreview';
import CardForm from './CardForm';
import GameGuideModal from './GameGuideModal';
import SendModal from './SendModal';
import SupportModal from './SupportModal';
import FAQSection from './FAQSection';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { CardData, HoodColor, GEAR_CATEGORIES, KINKS_CATEGORIES } from '../types';
import { generateCardImage } from '../services/geminiService';
import { Camera, AlertCircle } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

// ─── Constants ────────────────────────────────────────────────────────────────

const GEAR_KEYS_ORDERED = [
    { label: 'Rubber', prefix: 'rubber' },
    { label: 'Leather', prefix: 'leather' },
    { label: 'Sox/Sneaker', prefix: 'sneaker' },
    { label: 'Jocks/Undies', prefix: 'jocks' },
    { label: 'Furry', prefix: 'furry' },
    { label: 'MX/Biker', prefix: 'mx' },
    { label: 'Sportswear', prefix: 'sportswear' },
    { label: 'Tactical/Unif.', prefix: 'tactical' },
] as const;

const KINKS_KEYS_ORDERED = [
    { label: 'Outdoor/Dares', prefix: 'outdoor' },
    { label: 'Sniffing', prefix: 'sniffing' },
    { label: 'Edging', prefix: 'edging' },
    { label: 'Fisting', prefix: 'fisting' },
    { label: 'ABDL', prefix: 'abdl' },
    { label: 'Toys', prefix: 'toys' },
    { label: 'Cuckolding', prefix: 'cuckolding' },
    { label: 'Power Play', prefix: 'power' },
    { label: 'Chastity', prefix: 'chastity' },
    { label: 'BDSM', prefix: 'bdsm' },
    { label: 'Verbal', prefix: 'verbal' },
    { label: 'Dirty', prefix: 'dirty' },
] as const;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

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

const sanitizeForExport = (str: string | undefined): string =>
    String(str || '').replace(/[\t\n\r]/g, ' ').trim();

const calculateTotalBones = (gear: Record<string, number>, kinks: Record<string, number>): number =>
    Object.values(gear).reduce((s, v) => s + v, 0) + Object.values(kinks).reduce((s, v) => s + v, 0);

const dataURLtoBlob = (dataUrl: string): Blob => {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
};

const canvasCompress = (
    source: ImageBitmap | HTMLImageElement,
    srcWidth: number, srcHeight: number,
    maxWidth: number, quality: number,
): Promise<Blob> => {
    const width = Math.min(srcWidth, maxWidth);
    const height = Math.round(width / (srcWidth / srcHeight));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('Canvas context failed'));
    ctx.drawImage(source, 0, 0, width, height);
    if (source instanceof ImageBitmap) source.close();
    return new Promise((resolve, reject) =>
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
            'image/jpeg', quality,
        ),
    );
};

const compressToBlob = async (src: string, maxWidth: number, quality: number): Promise<Blob> => {
    if ((src.startsWith('blob:') || src.startsWith('data:')) && typeof createImageBitmap === 'function') {
        const blob = src.startsWith('data:') ? dataURLtoBlob(src) : await (await fetch(src)).blob();
        const bitmap = await createImageBitmap(blob);
        return canvasCompress(bitmap, bitmap.width, bitmap.height, maxWidth, quality);
    }
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        if (src.startsWith('http')) img.crossOrigin = 'anonymous';
        img.onload = () => canvasCompress(img, img.width, img.height, maxWidth, quality).then(resolve).catch(reject);
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = src;
    });
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) =>
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
            type, quality,
        ),
    );

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_CARD: CardData = {
    name: '', hoodColor: HoodColor.RED, imageUrl: '',
    birthdate: '', height: '', shoeSize: '', socialLink: '', country: '',
    termsConsent: false, decisionConsent: false,
    isCollectable: false, isOnlinePlayable: false, isAllowTrades: false,
    namePosition: 'left-top', statsPosition: 'right-middle',
    dogTricksPermission: false, dogTricks: [],
    imageZoom: 1, imagePosition: { x: 0, y: 0 },
    gear: Object.fromEntries(GEAR_CATEGORIES.map((c) => [c, 0])),
    kinks: Object.fromEntries(KINKS_CATEGORIES.map((c) => [c, 0])),
};

// ─── Modal reducer ────────────────────────────────────────────────────────────

type ModalState = { showSend: boolean; showSupport: boolean; showGuide: boolean; guideTab: 'basics' | 'diagram' };
type ModalAction =
    | { type: 'OPEN_SEND' } | { type: 'CLOSE_SEND' }
    | { type: 'OPEN_SUPPORT' } | { type: 'CLOSE_SUPPORT' }
    | { type: 'OPEN_GUIDE'; tab: 'basics' | 'diagram' } | { type: 'CLOSE_GUIDE' };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
    switch (action.type) {
        case 'OPEN_SEND':    return { ...state, showSend: true };
        case 'CLOSE_SEND':   return { ...state, showSend: false };
        case 'OPEN_SUPPORT': return { ...state, showSupport: true };
        case 'CLOSE_SUPPORT':return { ...state, showSupport: false };
        case 'OPEN_GUIDE':   return { ...state, showGuide: true, guideTab: action.tab };
        case 'CLOSE_GUIDE':  return { ...state, showGuide: false };
        default:             return state;
    }
};

// ─── Send-flow reducer ────────────────────────────────────────────────────────

type SendState = { isSending: boolean; status: 'idle' | 'sending' | 'success' | 'error'; error: string | null };
type SendAction =
    | { type: 'START' } | { type: 'SUCCESS' }
    | { type: 'ERROR'; error: string } | { type: 'CLEAR_ERROR' }
    | { type: 'RESET_STATUS' };

const sendReducer = (state: SendState, action: SendAction): SendState => {
    switch (action.type) {
        case 'START':        return { ...state, isSending: true, status: 'sending', error: null };
        case 'SUCCESS':      return { ...state, isSending: false, status: 'success' };
        case 'ERROR':        return { ...state, isSending: false, status: 'error', error: action.error };
        case 'CLEAR_ERROR':  return { ...state, status: 'idle', error: null };
        case 'RESET_STATUS': return { ...state, status: 'idle' };
        default:             return state;
    }
};

// ─── AppClient ────────────────────────────────────────────────────────────────

export default function AppClient() {
    const [card, setCard] = useState<CardData>(INITIAL_CARD);
    const [genState, setGenState] = useState({ isGenerating: false, error: null as string | null });
    const [modals, dispatchModal] = useReducer(modalReducer, {
        showSend: false, showSupport: false, showGuide: false, guideTab: 'basics' as const,
    });
    const [sendState, dispatchSend] = useReducer(sendReducer, {
        isSending: false, status: 'idle' as const, error: null,
    });

    const isIOS = useMemo(() => {
        if (typeof navigator === 'undefined') return false;
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    }, []);

    const isCardValid = (): boolean => {
        const fields = [card.name, card.imageUrl, card.birthdate, card.height, card.shoeSize, card.socialLink, card.country];
        const rawBones = calculateTotalBones(card.gear, card.kinks);
        const missingBones = Math.max(0, 50 - rawBones);
        const requiredTricks = Math.ceil(missingBones / 4);
        const tricksMakeUpShortfall = rawBones < 50
            ? card.dogTricksPermission && (card.dogTricks || []).length >= requiredTricks
            : true;
        return (
            fields.every((f) => f && f.trim() !== '') &&
            /^\d{4}\.\d{2}$/.test(card.birthdate) &&
            card.termsConsent && card.decisionConsent &&
            (rawBones >= 50 || tricksMakeUpShortfall) && rawBones <= 70
        );
    };

    const canSend = isCardValid();
    const isSendDisabled = sendState.isSending || sendState.status === 'success' || !canSend;

    const getPhotoshopTXTContent = (): string => {
        const gearHeaders = GEAR_KEYS_ORDERED.flatMap((item) => Array.from({ length: 5 }, (_, i) => `${item.prefix}${i + 1}`));
        const kinkHeaders = KINKS_KEYS_ORDERED.flatMap((item) => Array.from({ length: 5 }, (_, i) => `${item.prefix}${i + 1}`));
        const baseHeaders = ['namev', 'VariabledetextoAltura', 'VariabledetextoPie', 'pawsday', 'statsleft', 'statsright', 'nameleft', 'nameright'];
        const baseValues = [
            sanitizeForExport(card.name),
            sanitizeForExport((card.height || '').replace(/"/g, '')),
            sanitizeForExport(card.shoeSize || ''),
            sanitizeForExport(card.birthdate),
            card.statsPosition.includes('left') ? 'true' : 'false',
            card.statsPosition.includes('right') ? 'true' : 'false',
            card.namePosition.includes('left') ? 'true' : 'false',
            card.namePosition.includes('right') ? 'true' : 'false',
        ];
        const gearValues = GEAR_KEYS_ORDERED.flatMap((item) => {
            const val = card.gear[item.label] || 0;
            return Array.from({ length: 5 }, (_, i) => (val === i + 1 ? 'true' : 'false'));
        });
        const kinkValues = KINKS_KEYS_ORDERED.flatMap((item) => {
            const val = card.kinks[item.label] || 0;
            return Array.from({ length: 5 }, (_, i) => (val === i + 1 ? 'true' : 'false'));
        });
        const headers = [...baseHeaders, ...gearHeaders, ...kinkHeaders];
        const values = [...baseValues, ...gearValues, ...kinkValues];

        // Sort columns alphabetically by header name
        const pairs = headers.map((h, i) => [h, values[i]] as [string, string]);
        pairs.sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }));
        const sortedHeaders = pairs.map(p => p[0]);
        const sortedValues = pairs.map(p => p[1]);
        return `${sortedHeaders.join('\t')}\n${sortedValues.join('\t')}`;
    };

    const handleGenerateImageOnly = async () => {
        if (!card.name) return;
        setGenState({ isGenerating: true, error: null });
        try {
            const prompt = `${card.name}, ${card.hoodColor} hood human pup`;
            const imageBase64 = await generateCardImage(prompt, 'photo portrait, dramatic lighting, high quality');
            setCard((prev) => ({ ...prev, imageUrl: imageBase64 }));
        } catch (err) {
            console.error(err);
            setGenState((s) => ({ ...s, error: 'Failed to generate image.' }));
        } finally {
            setGenState((s) => ({ ...s, isGenerating: false }));
        }
    };

    const getCSVContent = (): string => {
        const txtContent = getPhotoshopTXTContent();
        const [headerRow, valueRow] = txtContent.split('\n');
        const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;
        const headers = headerRow.split('\t').map(csvCell).join(',');
        const values = valueRow.split('\t').map(csvCell).join(',');
        return `${headers}\n${values}`;
    };

    const getCardSchemaJSON = (): string => {
        const gearMap: Record<string, string> = {
            'Rubber': 'rubber', 'Leather': 'leather', 'Sox/Sneaker': 'skate',
            'Jocks/Undies': 'underwear', 'Furry': 'suit', 'MX/Biker': 'mx',
            'Sportswear': 'sports', 'Tactical/Unif.': 'tactical',
        };
        const kinkMap: Record<string, string> = {
            'Outdoor/Dares': 'outdoor', 'Sniffing': 'sniffing', 'Edging': 'edging',
            'Fisting': 'fisting', 'ABDL': 'abdl', 'Toys': 'toys',
            'Cuckolding': 'cuckolding', 'Power Play': 'powerplay', 'Chastity': 'chastity',
            'BDSM': 'bdsm', 'Verbal': 'verbal', 'Dirty': 'dirty',
        };
        const gear: Record<string, number> = {};
        for (const [label, key] of Object.entries(gearMap)) gear[key] = card.gear[label] ?? 0;
        const kinks: Record<string, number> = {};
        for (const [label, key] of Object.entries(kinkMap)) kinks[key] = card.kinks[label] ?? 0;

        // Per-category trick assignments (null = no trick needed / pending admin assignment)
        const gear_tricks: Record<string, null> = Object.fromEntries(Object.keys(gear).map((k) => [k, null]));
        const kinks_tricks: Record<string, null> = Object.fromEntries(Object.keys(kinks).map((k) => [k, null]));

        // instaUsername is the primary field when platform is Instagram (default).
        // social_link is only used when platform is 'other' (e.g. linktr.ee).
        const isInstagram = (card.socialPlatform || 'instagram') === 'instagram';
        return JSON.stringify({
            name: card.name,
            color: card.hoodColor.toLowerCase(),
            pawsday: card.birthdate,
            height: card.height,
            shoe_size: card.shoeSize,
            ...(isInstagram
                ? { instaUsername: card.socialLink }
                : { social_link: card.socialLink }),
            country: card.country,
            gear,
            kinks,
            gear_tricks,
            kinks_tricks,
            good_boy_title: 'Good Boy',
            rarity: 'common',
            is_custom: true,
            is_published: false,
            is_torn: false,
            is_sample: false,
            is_collectable_only: card.isCollectable ?? false,
            is_online_playable: card.isOnlinePlayable ?? false,
            allow_trades: card.isAllowTrades ?? false,
        }, null, 2);
    };

    const handleExportJSON = () =>
        downloadFile(getCardSchemaJSON(), `${card.name || 'card'}_card.json`, 'application/json;charset=utf-8');

    const handleExportPhotoshopTXT = () =>
        downloadFile(getPhotoshopTXTContent(), `${card.name || 'pup'}_ps_data.txt`, 'text/plain;charset=utf-8');

    const handleExportCSV = () =>
        downloadFile(getCSVContent(), `${card.name || 'pup'}_ps_data.csv`, 'text/csv;charset=utf-8');

    const handleFinalizeSend = async () => {
        dispatchSend({ type: 'START' });
        try {
            const node = document.getElementById('card-preview-container');
            if (!node) throw new Error('Card preview element not found');
            await document.fonts.ready;
            await new Promise(requestAnimationFrame);

            let capturedCardImage: string | null = null;
            let capturedCardBlob: Blob | null = null;
            try {
                if (isIOS) {
                    const canvas = await html2canvas(node, { useCORS: true, allowTaint: false, backgroundColor: '#000000', scale: 1, logging: false, width: 360 });
                    capturedCardBlob = await canvasToBlob(canvas, 'image/jpeg', 0.8);
                } else {
                    capturedCardImage = await htmlToImage.toPng(node, {
                        quality: 0.95, backgroundColor: '#000000', cacheBust: false, pixelRatio: 1, width: 360,
                        style: { transform: 'scale(1)', transformOrigin: 'top left', borderRadius: '0', margin: '0' },
                    });
                }
            } catch (e) { console.error('Card capture failed:', e); }

            let originalBlob: Blob | null = null;
            if (card.imageUrl) {
                try {
                    originalBlob = await compressToBlob(card.imageUrl, 800, 0.7);
                } catch (e) {
                    console.warn('Canvas compress failed, trying direct blob fetch:', e);
                    if (card.imageUrl.startsWith('blob:')) {
                        try { const resp = await fetch(card.imageUrl); originalBlob = await resp.blob(); }
                        catch (e2) { console.warn('Direct blob fetch also failed:', e2); }
                    }
                }
            }

            const cardCaptureBlob = capturedCardBlob ?? (capturedCardImage ? await compressToBlob(capturedCardImage, 800, 0.7) : null);
            if (!originalBlob && !cardCaptureBlob) throw new Error('Could not process your image. Please try a different photo.');

            const { imageUrl: _excluded, ...cardWithoutImage } = card;
            const jsonPart = JSON.stringify({ ...cardWithoutImage, totalBones: calculateTotalBones(card.gear, card.kinks), captureFailed: !cardCaptureBlob });
            const textPart = getPhotoshopTXTContent();
            const csvPart = getCSVContent();
            const schemaJsonPart = getCardSchemaJSON();
            const totalSize = (originalBlob?.size ?? 0) + (cardCaptureBlob?.size ?? 0) + new Blob([jsonPart]).size + new Blob([textPart]).size + new Blob([csvPart]).size + new Blob([schemaJsonPart]).size;

            if (totalSize > 3.5 * 1024 * 1024) throw new Error(`File size too large (${(totalSize / 1024 / 1024).toFixed(1)}MB). Please try a different photo.`);

            const formData = new FormData();
            formData.append('card', jsonPart);
            formData.append('cardText', textPart);
            formData.append('cardCSV', csvPart);
            formData.append('cardSchemaJSON', schemaJsonPart);
            if (originalBlob) formData.append('originalImage', originalBlob, `${card.name.replace(/\s+/g, '_')}_original.jpg`);
            if (cardCaptureBlob) formData.append('cardCapture', cardCaptureBlob, `${card.name.replace(/\s+/g, '_')}_card.jpg`);

            const response = await fetch('/api/send-card', { method: 'POST', body: formData });
            let result;
            try { result = await response.json(); } catch { throw new Error(`Server error (${response.status}). Please try again.`); }
            if (!response.ok) throw new Error(result.error || 'Failed to send card');

            // Log Base44 sync result to browser console for debugging
            if (result.sync) {
                if (result.sync.ok) {
                    console.log('[Base44 sync] ✅ OK', result.sync.status, result.sync.body);
                } else {
                    console.warn('[Base44 sync] ❌ Failed', result.sync.status, result.sync.body ?? result.sync.error);
                }
            }

            dispatchSend({ type: 'SUCCESS' });
        } catch (err: any) {
            let msg: string = err.message || 'An unexpected error occurred. Please try again.';
            if (msg.includes('Load failed') || msg.includes('d failed')) msg = 'Network request failed. Your image might still be too large or connection is unstable.';
            dispatchSend({ type: 'ERROR', error: msg });
        }
    };

    const handleDeveloperSupport = async () => {
        const stripePriceId = 'price_1SxT80QNT7knsC42AKh1AlAn';
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId: stripePriceId, metadata: { pup_name: card.name, social: card.socialLink } }),
            });
            const { url, error } = await response.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;
        } catch {
            window.open(`https://buy.stripe.com/00w28t5VP1D69IjdQcf3a01?client_reference_id=${stripePriceId}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-8 relative">

            <GameGuideModal isOpen={modals.showGuide} onClose={() => dispatchModal({ type: 'CLOSE_GUIDE' })} initialTab={modals.guideTab} />
            <SendModal
                isOpen={modals.showSend} onClose={() => dispatchModal({ type: 'CLOSE_SEND' })}
                contactPlatform={card.contactPlatform} telegramHandle={card.telegramHandle}
                submitStatus={sendState.status} sendError={sendState.error}
                isSending={sendState.isSending} isSendDisabled={isSendDisabled}
                onSubmit={handleFinalizeSend} onClearError={() => dispatchSend({ type: 'CLEAR_ERROR' })}
                onContinue={() => {
                    dispatchModal({ type: 'CLOSE_SEND' });
                    dispatchModal({ type: 'OPEN_SUPPORT' });
                    dispatchSend({ type: 'RESET_STATUS' });
                }}
            />
            <SupportModal isOpen={modals.showSupport} onClose={() => dispatchModal({ type: 'CLOSE_SUPPORT' })} onDeveloperSupport={handleDeveloperSupport} />

            <AppHeader
                canSend={canSend}
                onSend={() => dispatchModal({ type: 'OPEN_SEND' })}
                onExportTXT={handleExportPhotoshopTXT}
                onExportCSV={handleExportCSV}
                onExportJSON={handleExportJSON}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">

                {isIOS && (
                    <div className="mb-6 p-4 bg-amber-900/30 border border-amber-500/50 rounded-xl flex items-start gap-3 shadow-lg">
                        <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-bold text-amber-200">iOS Device Detected</p>
                            <p className="text-xs text-amber-300/80 mt-1">
                                Submission from iOS is supported. If the card screenshot fails to capture,
                                please <strong className="text-white">take a manual screenshot</strong> of your card preview and send it to Joker on Instagram.
                            </p>
                        </div>
                    </div>
                )}

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
                        <button onClick={() => dispatchModal({ type: 'OPEN_SEND' })} className="bg-white text-green-900 font-bold px-6 py-2 rounded-lg shadow hover:bg-green-50 transition-colors whitespace-nowrap">
                            Start Sending
                        </button>
                    </div>
                )}

                {genState.error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {genState.error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-6 xl:col-span-6 order-2 lg:order-1">
                        <CardForm card={card} setCard={setCard} onGenerateImage={handleGenerateImageOnly} isGeneratingImage={genState.isGenerating} />
                    </div>
                    <div className="lg:col-span-6 xl:col-span-6 order-1 lg:order-2 flex flex-col items-center">
                        <div className="sticky top-28">
                            <div className="mb-4 flex justify-between w-[360px] items-end">
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Live Preview</span>
                                <span className="text-xs text-slate-600">{card.name ? 'Ready to Battle' : 'Drafting...'}</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-bone-600 to-slate-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                                <CardPreview data={card} />
                            </div>
                            <div className="mt-8 max-w-md text-center">
                                <p className="text-slate-500 text-sm italic">&ldquo;Unleash your inner pup.&rdquo;</p>
                            </div>
                        </div>
                    </div>
                </div>

                <FAQSection />
            </main>

            <AppFooter onOpenGuide={(tab) => dispatchModal({ type: 'OPEN_GUIDE', tab })} />

        </div>
    );
}
