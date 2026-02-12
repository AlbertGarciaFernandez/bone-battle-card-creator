import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { card, imageData, cardText, cardCapture } = await req.json();

        if (!card || !imageData) {
            return NextResponse.json({ error: 'Missing card data or image data' }, { status: 400 });
        }

        // Helper to extract base64 content from a data URL
        const extractBase64 = (dataUrl: string) => {
            const matches = dataUrl.match(/^data:image\/([a-z]+);base64,(.+)$/);
            if (matches) return { ext: matches[1] === 'jpeg' ? 'jpg' : matches[1], content: matches[2] };
            return { ext: 'jpg', content: dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl };
        };

        const safeName = card.name.replace(/\s+/g, '_');
        const attachments: any[] = [];

        // 1. Original uploaded image (imageData is now always the user's photo)
        const img = extractBase64(imageData);
        attachments.push({
            filename: `${safeName}_original.${img.ext}`,
            content: img.content,
        });

        // 2. Data Text File
        if (cardText) {
            attachments.push({
                filename: `${safeName}_data.txt`,
                content: Buffer.from(cardText).toString('base64'),
            });
        }

        // 3. Card capture screenshot (optional — may not be available on mobile)
        if (cardCapture) {
            const cap = extractBase64(cardCapture);
            attachments.push({
                filename: `${safeName}_card.${cap.ext}`,
                content: cap.content,
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
