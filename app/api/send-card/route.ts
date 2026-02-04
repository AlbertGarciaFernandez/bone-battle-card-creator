import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { card, imageData } = await req.json();

        if (!card || !imageData) {
            return NextResponse.json({ error: 'Missing card data or image data' }, { status: 400 });
        }

        // Prepare email content
        const { data, error } = await resend.emails.send({
            from: 'Bone Battle <cards@codehunterlab.com>',
            to: 'albert@codehunterlab.com',
            subject: `Nueva Carta Creada: ${card.name}`,
            html: `
        <div style="font-family: sans-serif; color: #333 text-align: left;">
          <h1 style="color: #4f46e5;">Solicitud de Nueva Carta</h1>
          <p>Se ha recibido una nueva solicitud para Bone Battle.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>Nombre del Pup:</strong> ${card.name}</p>
            <p><strong>Color de Hood:</strong> ${card.hoodColor}</p>
            <p><strong>País:</strong> ${card.country}</p>
            <p><strong>Pawsday:</strong> ${card.birthdate}</p>
            <p><strong>Altura:</strong> ${card.height}</p>
            <p><strong>Shoe Size:</strong> ${card.shoeSize}</p>
            <p><strong>Social Link:</strong> ${card.socialLink}</p>
            <p><strong>Total Huesos:</strong> ${card.totalBones || 'N/A'}</p>
          </div>
          
          <p style="margin-top: 20px;">La imagen de la carta se encuentra adjunta a este correo.</p>
        </div>
      `,
            attachments: [
                {
                    filename: `${card.name.replace(/\s+/g, '_')}_card.png`,
                    content: imageData.split(',')[1],
                },
            ],
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
