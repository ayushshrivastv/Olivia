import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');
    const apiKey = process.env.XI_API_KEY;

    console.log('Signed URL request:', { agentId, hasKey: !!apiKey });

    if (!agentId) {
        return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }
    if (!apiKey) {
        console.error('XI_API_KEY is not set in environment variables');
        return NextResponse.json({ error: 'XI_API_KEY is not set' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
            {
                method: 'GET',
                headers: {
                    'xi-api-key': apiKey,
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', response.status, errorText);
            throw new Error(`Failed to get signed URL: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json({signedUrl: data.signed_url});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 });
    }
}
