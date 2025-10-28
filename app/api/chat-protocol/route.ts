/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    
    // Chat Protocol response format for ASI:One
    return NextResponse.json({
      protocol_version: "chat-asione-v1",
      agent_type: "voice-gibberlink",
      capabilities: ["voice", "gibberlink", "fetchai", "metta"],
      response: {
        text: message,
        voice_enabled: true,
        timestamp: Date.now()
      },
      context: context || {}
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Chat protocol error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Return agent capabilities for ASI:One discovery
  return NextResponse.json({
    protocol: "chat-asione-v1",
    agent_name: "GibberLink Voice Agent",
    capabilities: ["voice", "gibberlink", "blockchain", "knowledge"],
    endpoints: {
      chat: "/api/chat-protocol",
      voice: "/api/chat",
      blockchain: "/api/blockchain/verify",
      knowledge: "/api/metta/query"
    }
  });
}
