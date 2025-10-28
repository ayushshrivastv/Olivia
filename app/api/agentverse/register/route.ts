/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';
import { AgentverseService } from '@/services/AgentverseService';

const agentverseService = new AgentverseService();

export async function POST(req: Request) {
  try {
    const profile = await req.json();
    const result = await agentverseService.registerAgent(profile);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Agent registration failed' },
      { status: 500 }
    );
  }
}
