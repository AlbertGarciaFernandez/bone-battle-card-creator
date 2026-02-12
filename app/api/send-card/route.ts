import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const cardJson = formData.get('card') as string | null;
        const cardText = formData.get('cardText') as string | null;
        const originalImage = formData.get('originalImage') as File | null;
        const cardCapture = formData.get('cardCapture') as File | null;

        if (!cardJson) {
            return NextResponse.json({ error: 'Missing card data' }, { status: 400 });
        }

        const card = JSON.parse(cardJson);
        const safeName = (card.name || 'unknown').replace(/\s+/g, '_');
        const attachments: any[] = [];

        // 1. Original uploaded image (always sent)
        if (originalImage && originalImage.size > 0) {
            const buffer = Buffer.from(await originalImage.arrayBuffer());
            attachments.push({
                filename: originalImage.name || `${safeName}_original.jpg`,
                content: buffer,
            });
        }

        // 2. Data Text File
        if (cardText) {
            attachments.push({
                filename: `${safeName}_data.txt`,
                content: Buffer.from(cardText).toString('base64'),
            });
        }

        // 3. Card capture screenshot (optional — may not be available on mobile)
        if (cardCapture && cardCapture.size > 0) {
            const buffer = Buffer.from(await cardCapture.arrayBuffer());
            attachments.push({
                filename: cardCapture.name || `${safeName}_card.jpg`,
                content: buffer,
            });
        }

        // Prepare email content
        const { data, error } = await resend.emails.send({
            from: 'Bone Battle <cards@codehunterlab.com>',
            to: 'albert@codehunterlab.com',
            subject: `New Bone Battle Card: ${card.name}`,
            html: `
        <div style="font-family: sans-serif; color: #333; text-align: left;">
          <h1 style="color: #4f46e5;">New Card Request</h1>
          <p>A new card request has been received for Bone Battle.</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>Pup Name:</strong> ${card.name}</p>
            <p><strong>Hood Color:</strong> ${card.hoodColor}</p>
            <p><strong>Country:</strong> ${card.country}</p>
            <p><strong>Pawsday:</strong> ${card.birthdate}</p>
            <p><strong>Height:</strong> ${card.height}</p>
            <p><strong>Shoe Size:</strong> ${card.shoeSize}</p>
            <p><strong>Social Link:</strong> ${card.socialLink} (${card.socialPlatform || 'Instagram'})</p>
            <p><strong>Total Bones:</strong> ${card.totalBones || 'N/A'}</p>
            ${card.newsletter ? '<p><strong>Newsletter:</strong> YES - Subscribe me!</p>' : ''}
          </div>

          <p style="margin-top: 20px;">Attached:</p>
          <ul>
            <li>Original Uploaded Image</li>
            <li>Data Text File</li>
            ${cardCapture ? '<li>Card Preview Screenshot</li>' : '<li><em>Card screenshot not available (mobile submission)</em></li>'}
          </ul>
        </div>
      `,
            attachments: attachments,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
