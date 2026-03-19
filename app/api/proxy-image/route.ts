// src/app/api/proxy-image/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
        return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    try {
        // 1. Fetch the image data from the external URL using the backend server
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch image from external URL');
        }

        // 2. Read the response as an ArrayBuffer (raw binary data)
        const arrayBuffer = await response.arrayBuffer();

        // 3. Convert the ArrayBuffer to a Buffer
        const buffer = Buffer.from(arrayBuffer);

        // 4. Get the content type (image/jpeg, image/png, etc.)
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // 5. Convert the Buffer to a Base64 string
        const base64String = buffer.toString('base64');

        // 6. Construct the data URL that the browser loves to handle
        const dataUrl = `data:${contentType};base64,${base64String}`;

        // 7. Send the safe data URL back to the frontend
        return NextResponse.json({ dataUrl });

    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}