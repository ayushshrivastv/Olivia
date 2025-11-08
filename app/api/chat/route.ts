/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */

import OpenAI from 'openai'
import { NextResponse } from 'next/server';
import { FetchAIBlockchainService } from '@/services/FetchAIService';
import { MettaKnowledgeService } from '@/services/MettaKnowledgeService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const blockchainService = new FetchAIBlockchainService();
const mettaService = new MettaKnowledgeService();

export async function POST(req: Request) {
  try {
    const { messages, agentType, sessionId, useMetta, useBlockchain } = await req.json();
    
    const enhancedMessages = [...messages];
    let blockchainTx = null;
    let mettaKnowledge = null;

    // Query MeTTa if enabled
    if (useMetta && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      mettaKnowledge = await mettaService.queryKnowledge(lastMessage.content);
      
      enhancedMessages.push({
        role: 'system',
        content: `Knowledge from MeTTa: ${mettaKnowledge.answer}`
      });
    }

    // Get LLM response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: enhancedMessages,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    const responseMessage = completion.choices[0].message;

    // Verify on blockchain if enabled
    if (useBlockchain) {
      blockchainTx = await blockchainService.verifyVoiceInteraction(
        sessionId,
        agentType,
        responseMessage.content || ""
      );
    }

    return NextResponse.json({
      ...responseMessage,
      blockchainTx,
      mettaKnowledge,
      web3Enhanced: !!(useMetta || useBlockchain)
    });
  } catch (error) {
    console.error('Enhanced chat API error:', error);
    return NextResponse.json(
      { error: 'AI Service Unavailable' },
      { status: 503 }
    );
  }
}