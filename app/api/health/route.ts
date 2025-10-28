/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    services: {
      blockchain: process.env.NEXT_PUBLIC_FETCHAI_TESTNET_RPC ? 'configured' : 'missing',
      metta: process.env.NEXT_PUBLIC_METTA_ENDPOINT ? 'configured' : 'missing',
      agentverse: process.env.NEXT_PUBLIC_AGENTVERSE_API ? 'configured' : 'missing',
      elevenlabs: process.env.XI_API_KEY ? 'configured' : 'missing',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
    },
    timestamp: Date.now()
  };

  return NextResponse.json(health);
}
