"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface BlockchainTx {
  txHash: string;
  height?: number;
  verified?: boolean;
  demo?: boolean;
  explorerUrl?: string | null;
  error?: string;
}

interface MettaKnowledge {
  answer: string;
  confidence?: number;
  sources?: string[];
  knowledge?: Record<string, any>;
}

interface TranscriptProps {
  messages: ChatMessage[];
  blockchainTx?: BlockchainTx | null;
  mettaKnowledge?: MettaKnowledge | null;
}

export function VoiceChatTranscript({
  messages,
  blockchainTx,
  mettaKnowledge
}: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-32 left-4 w-96 max-h-96 bg-white rounded-lg p-4 overflow-hidden z-40 border border-gray-300 shadow-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="bg-black text-white px-6 py-3 rounded-full text-base font-semibold tracking-tight !bg-black !text-white">
          {process.env.NEXT_PUBLIC_OLIVIA_NAME || 'Olivia'}
        </span>
        <div className="flex items-center gap-2 justify-end">
          <Image
            src="/image.png"
            alt="ASI:One"
            width={80}
            height={30}
            className="h-18 w-auto object-contain"
            priority
          />
        </div>
      </div>

      <div ref={scrollRef} className="space-y-2 overflow-y-auto max-h-80 scroll-smooth">
        {messages
          .filter(msg => msg.role !== 'system')
          .map((msg, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-gray-100 text-gray-800 text-base leading-relaxed"
            >
              <div className="text-sm font-semibold mb-1.5 text-gray-500">
                {msg.role === 'user' ? 'You' : (process.env.NEXT_PUBLIC_OLIVIA_NAME || 'Olivia')}
              </div>
              <div className="text-gray-900 break-words whitespace-pre-wrap">{msg.content.replace('[GL MODE]: ', '')}</div>
            </div>
          ))}
        <div ref={messagesEndRef} className="h-6" />
      </div>

      {blockchainTx && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700 border border-green-200">
          {blockchainTx.demo ? (
            <>
              🎭 Demo Mode: {blockchainTx.txHash.substring(0, 20)}...
              <br />
              <span className="text-gray-600">Configure real testnet for live verification</span>
            </>
          ) : (
            <>
              Verified on Fetch.ai: {blockchainTx.txHash.substring(0, 16)}...
              {blockchainTx.explorerUrl && (
                <><br />
                  <a
                    href={blockchainTx.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View on Explorer →
                  </a>
                </>
              )}
            </>
          )}
        </div>
      )}

      {mettaKnowledge && (
        <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700 border border-purple-200">
          🧠 MeTTa Knowledge: {mettaKnowledge.answer.substring(0, 50)}...
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-gray-500 text-base text-center mt-4">
          Start conversation to see transcript...
        </div>
      )}
    </div>
  );
}
