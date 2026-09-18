import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export async function POST(req: Request) {
    try {
        if (!checkRateLimit(`generate:${getClientIp(req)}`)) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[generate] GEMINI_API_KEY is not configured');
            return NextResponse.json({ error: 'AI generation is not available right now.' }, { status: 503 });
        }

        const body = await req.json().catch(() => null);
        const name = typeof body?.name === 'string' ? body.name.trim() : '';
        if (!name || name.length > 100) {
            return NextResponse.json({ error: 'Invalid pup name' }, { status: 400 });
        }
        const hoodColor = typeof body?.hoodColor === 'string' ? body.hoodColor.trim().slice(0, 50) : '';

        const prompt = `
            A portrait photo of a human puppy player wearing a hood. ${name}, ${hoodColor} hood human pup.
            Style: photo portrait, dramatic lighting, high quality.
            The character is wearing a pup hood matching their main color.
            High quality, photorealistic or digital art style, centered composition, looking at camera.
            No text in the image.
        `;

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt,
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData) {
                return NextResponse.json({
                    imageDataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                });
            }
        }

        console.error('[generate] No image data found in Gemini response');
        return NextResponse.json({ error: 'Failed to generate image.' }, { status: 502 });
    } catch (err) {
        console.error('[generate] Error:', err);
        return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
    }
}
