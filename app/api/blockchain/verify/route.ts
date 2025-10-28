/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';
import { FetchAIBlockchainService } from '@/services/FetchAIService';

const blockchainService = new FetchAIBlockchainService();

export async function POST(req: Request) {
  try {
    const { sessionId, agentType, message } = await req.json();
    
    const result = await blockchainService.verifyVoiceInteraction(
      sessionId,
      agentType,
      message
    );

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Blockchain verification error:', error);
    return NextResponse.json(
      { error: 'Blockchain verification failed', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const address = await blockchainService.getAgentAddress();
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: 'Failed to get address' }, { status: 500 });
  }
}
