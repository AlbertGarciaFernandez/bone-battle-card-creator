import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { card, imageData, cardText, originalImage } = await req.json();

        if (!card || !imageData) {
            return NextResponse.json({ error: 'Missing card data or image data' }, { status: 400 });
        }

        // Prepare attachments
        const attachments: any[] = [
            {
                filename: `${card.name.replace(/\s+/g, '_')}_card.png`,
                content: imageData.split(',')[1],
            }
        ];

        if (cardText) {
            attachments.push({
                filename: `${card.name.replace(/\s+/g, '_')}_data.txt`,
                content: Buffer.from(cardText).toString('base64'),
            });
        }

        if (originalImage) {
            // Handle potential base64 prefix
            const matches = originalImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                attachments.push({
                    filename: `${card.name.replace(/\s+/g, '_')}_original.jpg`, // Assuming jpg/png, but filename extension might need to be dynamic if strictly needed, though .jpg usually works for preview
                    content: matches[2],
                });
            }
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
            <li>Generated Card Image</li> 
            <li>Data Text File</li>
            <li>Original Uploaded Image</li>
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
