/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
import Groq from 'groq-sdk/index.mjs'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })

    return NextResponse.json(completion.choices[0].message)
  } catch (error) {
    console.error('Groq API Error:', error)
    return NextResponse.json(
      { error: 'AI Service Unavailable' },
      { status: 503 }
    )
  }
}
