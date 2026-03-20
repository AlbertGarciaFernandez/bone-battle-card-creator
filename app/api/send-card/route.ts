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

/** Extract Instagram username from a handle, profile URL, or plain username */
const extractIgUsername = (link: string): string => {
    const raw = String(link || '').trim().replace(/^@/, '');
    try {
        const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
        const parts = url.pathname.replace(/\/$/, '').split('/').filter(Boolean);
        return parts[parts.length - 1] || raw;
    } catch {
        return raw;
    }
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const cardJson = formData.get('card') as string | null;
        const cardText = formData.get('cardText') as string | null;
        const cardCSV = formData.get('cardCSV') as string | null;
        const cardSchemaJSON = formData.get('cardSchemaJSON') as string | null;
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

        // 1. Original uploaded image — read buffer once, reuse for email + API sync
        let originalImageBuffer: Buffer | null = null;
        if (originalImage && originalImage.size > 0) {
            originalImageBuffer = Buffer.from(await originalImage.arrayBuffer());
            attachments.push({
                filename: originalImage.name || `${safeName}_original.jpg`,
                content: originalImageBuffer,
            });
        }

        // 2. Photoshop data text file — commented out, not sent as attachment
        // if (cardText) {
        //     attachments.push({
        //         filename: `${safeName}_data.txt`,
        //         content: Buffer.from(cardText).toString('base64'),
        //     });
        // }

        // 3. CSV data file — commented out, not sent as attachment
        // if (cardCSV) {
        //     attachments.push({
        //         filename: `${safeName}_data.csv`,
        //         content: Buffer.from(cardCSV).toString('base64'),
        //     });
        // }

        // 4. Schema JSON (Card.json format for app import)
        if (cardSchemaJSON) {
            attachments.push({
                filename: `${safeName}_card.json`,
                content: Buffer.from(cardSchemaJSON).toString('base64'),
            });
        }

        // 4. Card capture screenshot (optional — may not be available on mobile)
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

        // ── Social link ───────────────────────────────────────────────────────
        const platform = card.socialPlatform || 'Instagram';
        const isInstagram = platform.toLowerCase() === 'instagram';
        const igUsername = isInstagram ? extractIgUsername(card.socialLink) : '';
        const socialHtml = isInstagram
            ? `<a href="http://ig.me/m/${igUsername}" style="color:#818cf8;text-decoration:none;">@${esc(igUsername)}</a>
               &nbsp;<a href="http://ig.me/m/${igUsername}" style="display:inline-block;margin-left:8px;background:#833ab4;color:#fff;font-size:11px;padding:2px 8px;border-radius:4px;text-decoration:none;">📩 DM on Instagram</a>`
            : `${esc(card.socialLink)} (${esc(platform)})`;

        // ── Contact preference (Telegram) ─────────────────────────────────────
        const contactPlatform = card.contactPlatform || 'instagram';
        const isTelegram = contactPlatform === 'telegram';
        const telegramHandle = isTelegram ? String(card.telegramHandle || '').trim().replace(/^@/, '') : '';
        const contactHtml = isTelegram && telegramHandle
            ? `<a href="https://t.me/${telegramHandle}" style="color:#38bdf8;text-decoration:none;">@${esc(telegramHandle)}</a>
               &nbsp;<a href="https://t.me/${telegramHandle}" style="display:inline-block;margin-left:8px;background:#0088cc;color:#fff;font-size:11px;padding:2px 8px;border-radius:4px;text-decoration:none;">✈️ Message on Telegram</a>`
            : '';

        // ── Email HTML ────────────────────────────────────────────────────────
        const html = `
<div style="font-family:sans-serif;color:#e2e8f0;background:#0f172a;padding:32px;border-radius:12px;max-width:640px;">

  <h1 style="color:#818cf8;margin:0 0 4px;">🦴 New Card Request</h1>
  <p style="color:#94a3b8;margin:0 0 24px;font-size:14px;">A new Bone Battle card submission has arrived.</p>

  <div style="background:#1e293b;padding:20px;border-radius:8px;line-height:2;">
    <p style="margin:0"><strong style="color:#94a3b8;">Pup Name:</strong> ${esc(card.name)}</p>
    <p style="margin:0"><strong style="color:#94a3b8;">Social:</strong> ${socialHtml}</p>
    ${contactHtml ? `<p style="margin:0"><strong style="color:#94a3b8;">Contact via:</strong> ${contactHtml}</p>` : ''}
    <p style="margin:0"><strong style="color:#94a3b8;">Total Bones:</strong> ${esc(card.totalBones ?? 'N/A')}</p>
    ${card.newsletter ? '<p style="margin:0"><strong style="color:#34d399;">Newsletter:</strong> ✅ Subscribe me!</p>' : ''}
    ${dogTricksHtml}
  </div>

  <div style="margin-top:20px;background:#1e293b;padding:16px 20px;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:bold;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Attachments</p>
    <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:2;">
      ${originalImage && originalImage.size > 0 ? '<li>Original Uploaded Image</li>' : ''}
      ${cardSchemaJSON ? '<li>Card Schema JSON (.json)</li>' : ''}
      <!-- ${cardText ? '<li>Photoshop Data Text File (.txt)</li>' : ''} -->
      <!-- ${cardCSV ? '<li>CSV Data File (.csv)</li>' : ''} -->
      ${cardCapture && cardCapture.size > 0
            ? '<li>Card Preview Screenshot</li>'
            : '<li style="color:#64748b;font-style:italic;">Card screenshot not available (mobile or capture failed)</li>'}
    </ul>
  </div>

  ${cardSchemaJSON ? `
  <div style="margin-top:20px;">
    <p style="margin:0 0 6px;font-weight:bold;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Card JSON</p>
    <pre style="margin:0;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:16px;font-size:11px;line-height:1.6;color:#e6edf3;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${esc(cardSchemaJSON)}</pre>
  </div>` : ''}

</div>`;

        const { data, error } = await resend.emails.send({
            from: 'Bone Battle <cards@codehunterlab.com>',
            to: ['albert@codehunterlab.com'],
            subject: `New Bone Battle Card: ${card.name}${hasDogTricks ? ' 🐕' : ''}`,
            html,
            attachments,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // ── Sync to external app — DISABLED FOR TESTING ──────────────────────
        // Re-enable by uncommenting the block below
        /*
to: ['albert@codehunterlab.com', 'pup.joker.jx@gmail.com'],

        if (cardSchemaJSON) {
            const appApiBase = process.env.APP_API_BASE || 'https://bonebattle.base44.app';
            const appApiKey = process.env.APP_API_KEY || 'bc55db07135e4fdf850a550300b46303';
            const appId = '69859fe3e323b5c0e80da0c3';
            (async () => {
                try {
                    const headers = { 'api_key': appApiKey, 'Content-Type': 'application/json' };
                    const cardPayload = JSON.parse(cardSchemaJSON);
                    if (originalImageBuffer) {
                        const photoMime = originalImage?.type || 'image/jpeg';
                        cardPayload.pup_photo = `data:${photoMime};base64,${originalImageBuffer.toString('base64')}`;
                    }
                    const cardRes = await fetch(`${appApiBase}/api/apps/${appId}/entities/Card`, {
                        method: 'POST', headers, body: JSON.stringify(cardPayload),
                    });
                    const cardResult = await cardRes.json();
                    const createdCardId: string | null = cardResult?.id ?? cardResult?._id ?? null;
                    const submission: Record<string, unknown> = {
                        submission_type: 'new_digital_card',
                        status: 'pending',
                        privacy_consent: true,
                        claimed_by: '',
                        creator_name: cardPayload.name ?? '',
                        creator_link: cardPayload.social_link ?? '',
                    };
                    if (createdCardId) submission.linked_card_id = createdCardId;
                    await fetch(`${appApiBase}/api/apps/${appId}/entities/CardSubmission`, {
                        method: 'POST', headers, body: JSON.stringify(submission),
                    });
                } catch (appErr) {
                    console.error('External app sync failed:', appErr);
                }
            })();
        }
        */

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
