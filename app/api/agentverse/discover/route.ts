/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';
import { AgentverseService } from '@/services/AgentverseService';

const agentverseService = new AgentverseService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const capability = searchParams.get('capability') || undefined;
    
    const agents = await agentverseService.discoverAgents(capability);

    return NextResponse.json({ agents });
  } catch {
    return NextResponse.json({ error: 'Discovery failed' }, { status: 500 });
  }
}
