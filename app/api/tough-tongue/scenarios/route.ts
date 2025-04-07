import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.TOUGH_TONGUE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Tough Tongue API key is not configured' },
        { status: 500 }
      );
    }

    // Set default values and process request body
    const payload: {
      name: any;
      description: any;
      ai_instructions: any;
      is_public: boolean;
      is_recording: boolean;
      user_friendly_description?: string;
    } = {
      name: body.name,
      description: body.description,
      ai_instructions: body.ai_instructions,
      is_public: true, // Always true as requested
      is_recording: false // Always false as requested
    };

    // Only add user_friendly_description if it's provided and not empty
    if (body.user_friendly_description && body.user_friendly_description.trim() !== '') {
      payload.user_friendly_description = body.user_friendly_description;
    }

    // Call Tough Tongue API
    const response = await fetch('https://api.toughtongueai.com/api/public/scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create scenario', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Tough Tongue scenario:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the scenario' },
      { status: 500 }
    );
  }
} 