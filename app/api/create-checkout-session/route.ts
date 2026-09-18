import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

const isSafeUrl = (url: string | undefined, origin: string | null): boolean => {
    if (!url) return false;
    if (!/^\/(?!\/)/.test(url)) return false;
    if (origin) {
        try {
            return new URL(url, origin).origin === origin;
        } catch {
            return false;
        }
    }
    return true;
};

export async function POST(req: Request) {
    try {
        if (!checkRateLimit(`checkout:${getClientIp(req)}`)) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            console.error('[checkout] STRIPE_SECRET_KEY is not configured');
            return NextResponse.json({ error: 'Payments are not available right now.' }, { status: 503 });
        }

        const stripe = new Stripe(secretKey, {
            apiVersion: '2026-01-28.clover' as any,
        });

        const body = await req.json().catch(() => null);
        const priceId = typeof body?.priceId === 'string' ? body.priceId : '';
        const successUrl = typeof body?.successUrl === 'string' ? body.successUrl : undefined;
        const cancelUrl = typeof body?.cancelUrl === 'string' ? body.cancelUrl : undefined;
        const metadata = body?.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
            ? body.metadata
            : {};

        if (!priceId) {
            return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
        }

        const origin = req.headers.get('origin');
        const fallbackSuccess = `${origin ?? ''}/?success=true`;
        const fallbackCancel = `${origin ?? ''}/?canceled=true`;

        if ((successUrl && !isSafeUrl(successUrl, origin)) || (cancelUrl && !isSafeUrl(cancelUrl, origin))) {
            return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 });
        }

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl || fallbackSuccess,
            cancel_url: cancelUrl || fallbackCancel,
            // Stripe Metadata helps track specifically which user/card this payment belongs to
            metadata: {
                ...metadata,
                project: 'Bone Battle Card Creator'
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 });
    }
}
