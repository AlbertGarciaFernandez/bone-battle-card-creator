export const generateCardImage = async (name: string, hoodColor: string): Promise<string> => {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, hoodColor }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to generate image.');
    }

    const { imageDataUrl } = await res.json();
    if (!imageDataUrl) throw new Error('No image data returned.');
    return imageDataUrl;
};
