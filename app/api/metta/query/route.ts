/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import { NextResponse } from 'next/server';
import { MettaKnowledgeService } from '@/services/MettaKnowledgeService';

const mettaService = new MettaKnowledgeService();

export async function POST(req: Request) {
  try {
    const { query, context } = await req.json();
    
    const result = await mettaService.queryKnowledge(query, context);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('MeTTa query error:', error);
    return NextResponse.json(
      { error: 'Knowledge query failed', details: error },
      { status: 500 }
    );
  }
}
