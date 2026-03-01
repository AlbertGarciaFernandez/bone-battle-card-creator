import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

type Attachment = {
    filename: string;
    content: Buffer | string;
};

/** Escape HTML special characters to prevent injection in the email body */
const esc = (val: unknown): string =>
    String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

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

        let card: Record<string, any>;
        try {
            card = JSON.parse(cardJson);
        } catch {
            return NextResponse.json({ error: 'Invalid card data' }, { status: 400 });
        }

        // Sanitize filename — only alphanumeric, underscores and hyphens
        const safeName = (card.name || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
        const attachments: Attachment[] = [];

        // 1. Original uploaded image
        if (originalImage && originalImage.size > 0) {
            attachments.push({
                filename: originalImage.name || `${safeName}_original.jpg`,
                content: Buffer.from(await originalImage.arrayBuffer()),
            });
        }

        // 2. Photoshop data text file
        if (cardText) {
            attachments.push({
                filename: `${safeName}_data.txt`,
                content: Buffer.from(cardText).toString('base64'),
            });
        }

        // 3. Card capture screenshot (optional — may not be available on mobile)
        if (cardCapture && cardCapture.size > 0) {
            attachments.push({
                filename: cardCapture.name || `${safeName}_card.jpg`,
                content: Buffer.from(await cardCapture.arrayBuffer()),
            });
        }

        // ── Dog Tricks section ────────────────────────────────────────────────
        const hasDogTricks = card.dogTricksPermission === true;
        const selectedTricks: string[] = Array.isArray(card.dogTricks) ? card.dogTricks : [];
        const missingBones = Math.max(0, 50 - (card.totalBones ?? 0));
        const requiredTricks = Math.ceil(missingBones / 4);

        const dogTricksHtml = hasDogTricks ? `
          <div style="background-color:#1c1506;border-left:4px solid #d97706;padding:16px 20px;border-radius:6px;margin-top:16px;">
            <p style="margin:0 0 8px;font-weight:bold;color:#fbbf24;font-size:14px;">🐕 Bones Under 50 Balance — Dog Tricks Agreed</p>
            <p style="margin:0 0 6px;color:#fcd34d;font-size:13px;">
              Bones short: <strong>${missingBones}</strong> &nbsp;|&nbsp;
              Tricks required: <strong>${requiredTricks}</strong> &nbsp;|&nbsp;
              Tricks selected: <strong>${selectedTricks.length}</strong>
            </p>
            ${selectedTricks.length > 0
                ? `<ul style="margin:8px 0 0;padding-left:18px;color:#fde68a;font-size:13px;line-height:2;">
                    ${selectedTricks.map((t) => `<li>${esc(t)}</li>`).join('')}
                   </ul>`
                : `<p style="margin:6px 0 0;color:#92400e;font-size:12px;font-style:italic;">No tricks selected.</p>`}
          </div>` : '';

        // ── Email HTML ────────────────────────────────────────────────────────
        const html = `
<div style="font-family:sans-serif;color:#e2e8f0;background:#0f172a;padding:32px;border-radius:12px;max-width:600px;">

  <h1 style="color:#818cf8;margin:0 0 4px;">🦴 New Card Request</h1>
  <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">A new Bone Battle card submission has arrived.</p>

  <div style="background:#1e293b;padding:20px;border-radius:8px;line-height:2;">
    <p style="margin:0"><strong style="color:#94a3b8;">Pup Name:</strong> ${esc(card.name)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Hood Color:</strong> ${esc(card.hoodColor)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Country:</strong> ${esc(card.country)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Pawsday:</strong> ${esc(card.birthdate)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Height:</strong> ${esc(card.height)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Shoe Size:</strong> ${esc(card.shoeSize)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Social:</strong> ${esc(card.socialLink)} (${esc(card.socialPlatform || 'Instagram')})</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Total Bones:</strong> ${esc(card.totalBones ?? 'N/A')}</p>
    ${card.newsletter ? '<p style="margin:0"><strong style="color:#34d399;">Newsletter:</strong> ✅ Subscribe me!</p>' : ''}
    ${dogTricksHtml}
  </div>

  <div style="margin-top:20px;background:#1e293b;padding:16px 20px;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:bold;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Attachments</p>
    <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:2;">
      ${originalImage && originalImage.size > 0 ? '<li>Original Uploaded Image</li>' : ''}
      ${cardText ? '<li>Photoshop Data Text File</li>' : ''}
      ${cardCapture && cardCapture.size > 0
            ? '<li>Card Preview Screenshot</li>'
            : '<li style="color:#64748b;font-style:italic;">Card screenshot not available (mobile or capture failed)</li>'}
    </ul>
  </div>

</div>`;

        const { data, error } = await resend.emails.send({
            from: 'Bone Battle <cards@codehunterlab.com>',
            to: 'albert@codehunterlab.com',
            subject: `New Bone Battle Card: ${card.name}${hasDogTricks ? ' 🐕' : ''}`,
            html,
            attachments,
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
