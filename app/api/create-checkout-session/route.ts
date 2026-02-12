import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2026-01-28.clover' as any,
        });
        const { priceId, successUrl, cancelUrl, metadata } = await req.json();

        if (!priceId) {
            return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
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
            success_url: successUrl || `${req.headers.get('origin')}/?success=true`,
            cancel_url: cancelUrl || `${req.headers.get('origin')}/?canceled=true`,
            // Stripe Metadata helps track specifically which user/card this payment belongs to
            metadata: {
                ...metadata,
                project: 'Bone Battle Card Creator'
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
