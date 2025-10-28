"""
Voice Protocol for Olivia uAgent
Handles voice-based messages with MeTTa knowledge and blockchain verification
"""

import os
from uagents import Protocol, Context
from ..models import VoiceMessage, VoiceResponse
from ..services.metta_service import MettaService
from ..services.blockchain_service import BlockchainService

# OpenAI client for LLM responses
try:
    from openai import OpenAI

    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except ImportError:
    openai_client = None


voice_protocol = Protocol("Voice", version="1.0.0")
metta_service = MettaService()
blockchain_service = BlockchainService()


@voice_protocol.on_message(model=VoiceMessage, replies=VoiceResponse)
async def handle_voice_message(ctx: Context, sender: str, msg: VoiceMessage):
    """
    Handle incoming voice message
    Processes the message with LLM, optionally queries MeTTa, and verifies on blockchain
    """
    ctx.logger.info(f"Received voice message from {sender}: {msg.text[:50]}...")

    try:
        # Build conversation messages
        messages = [{"role": "user", "content": msg.text}]

        # Query MeTTa if enabled
        metta_knowledge = None
        if msg.use_metta:
            try:
                result = await metta_service.query(
                    msg.text,
                    context={
                        "agent_type": msg.agent_type,
                        "session_id": msg.session_id,
                    },
                )
                metta_knowledge = {
                    "answer": result.answer,
                    "confidence": result.confidence,
                    "sources": result.sources,
                }
                messages.append(
                    {
                        "role": "system",
                        "content": f"Knowledge from MeTTa: {result.answer}",
                    }
                )
            except Exception as e:
                ctx.logger.warning(f"MeTTa query failed: {e}")

        # Get LLM response
        response_text = "I'm processing your request..."
        if openai_client:
            try:
                completion = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=1,
                    max_tokens=1024,
                )
                response_text = completion.choices[0].message.content or "No response"
            except Exception as e:
                ctx.logger.error(f"OpenAI API error: {e}")
                response_text = (
                    "I'm experiencing some technical difficulties. Please try again."
                )
        else:
            response_text = f"Response to: {msg.text}"

        # Verify on blockchain if enabled
        blockchain_tx = None
        if msg.use_blockchain:
            try:
                blockchain_tx = await blockchain_service.verify_voice_interaction(
                    msg.session_id, msg.agent_type, response_text
                )
            except Exception as e:
                ctx.logger.warning(f"Blockchain verification failed: {e}")

        # Send response
        await ctx.send(
            sender,
            VoiceResponse(
                text=response_text,
                session_id=msg.session_id,
                metta_knowledge=metta_knowledge,
                blockchain_tx=blockchain_tx,
                web3_enhanced=bool(metta_knowledge or blockchain_tx),
            ),
        )

        ctx.logger.info(f"Sent voice response to {sender}")

    except Exception as e:
        ctx.logger.error(f"Error handling voice message: {e}")
        await ctx.send(
            sender,
            VoiceResponse(
                text="I encountered an error processing your request.",
                session_id=msg.session_id,
                web3_enhanced=False,
            ),
        )
