/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';
import { uAgentBridge } from '@/services/UAgentBridge';

export async function POST(req: Request) {
  try {
    const { message, user_id, session_id, context } = await req.json();

    // Forward to uAgent via bridge
    const response = await uAgentBridge.sendMessage({
      protocol: 'chat',
      data: {
        message,
        user_id: user_id || `user_${Date.now()}`,
        session_id: session_id || `session_${Date.now()}`,
        context: context || {}
      }
    });

    if (!response.success) {
      throw new Error(response.error || 'Agent communication failed');
    }

    // Return ASI:One Chat Protocol format
    return NextResponse.json({
      type: "agent_message",
      agent_address: process.env.FETCHAI_AGENT_ADDRESS || "agent1q...",
      message: response.data?.message || response.data?.text || "I received your message",
      timestamp: Date.now(),
      metadata: {
        voice_enabled: true,
        gibberlink_capable: true,
        metta_enhanced: true,
        blockchain_verified: true,
        protocol_version: "chat-asione-v1"
      }
    });
  } catch (error) {
    console.error('Chat protocol error:', error);
    return NextResponse.json(
      { error: 'Chat protocol error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return agent capabilities for ASI:One discovery
  return NextResponse.json({
    protocol: "chat-asione-v1",
    agent_name: process.env.UAGENT_NAME || "Olivia",
    agent_address: process.env.FETCHAI_AGENT_ADDRESS || "agent1q...",
    capabilities: ["voice", "gibberlink", "fetchai", "metta", "chat"],
    protocols: ["voice", "gibberlink", "chat"],
    endpoints: {
      chat: "/api/chat-protocol",
      voice: "/api/chat",
      blockchain: "/api/blockchain/verify",
      knowledge: "/api/metta/query"
    },
    description: "AI voice assistant with GibberLink protocol, MeTTa knowledge, and Fetch.ai blockchain verification"
  });
}
