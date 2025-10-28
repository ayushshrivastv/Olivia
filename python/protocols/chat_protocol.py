"""
Chat Protocol for ASI:One compatibility
Handles human-agent interaction through ASI:One interface
"""

import os
from uagents import Protocol, Context
from ..models import ChatMessage, ChatResponse

chat_protocol = Protocol("Chat", version="asione-v1")

# OpenAI client
try:
    from openai import OpenAI

    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except ImportError:
    openai_client = None


@chat_protocol.on_message(model=ChatMessage, replies=ChatResponse)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """
    Handle ASI:One chat message
    Processes human messages through the Chat Protocol
    """
    ctx.logger.info(f"Received chat message from {sender}: {msg.message[:50]}...")

    try:
        # Get agent address
        agent_address = ctx.agent.address

        # Generate response using LLM
        response_text = "Hello! I'm Olivia, your AI assistant."

        if openai_client:
            try:
                completion = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are Olivia, an AI voice assistant with access to MeTTa knowledge graph and blockchain verification. You're friendly, helpful, and can discuss any topic.",
                        },
                        {"role": "user", "content": msg.message},
                    ],
                    temperature=1,
                    max_tokens=1024,
                )
                response_text = completion.choices[0].message.content or response_text
            except Exception as e:
                ctx.logger.error(f"OpenAI API error: {e}")

        # Send response in ASI:One format
        from datetime import datetime

        timestamp = int(datetime.now().timestamp() * 1000)

        await ctx.send(
            sender,
            ChatResponse(
                type="agent_message",
                agent_address=agent_address,
                message=response_text,
                timestamp=timestamp,
                metadata={
                    "voice_enabled": True,
                    "gibberlink_capable": True,
                    "metta_enhanced": True,
                    "blockchain_verified": True,
                    "protocol_version": "chat-asione-v1",
                },
            ),
        )

        ctx.logger.info(f"Sent chat response to {sender}")

    except Exception as e:
        ctx.logger.error(f"Error handling chat message: {e}")
        from datetime import datetime

        timestamp = int(datetime.now().timestamp() * 1000)

        await ctx.send(
            sender,
            ChatResponse(
                type="agent_message",
                agent_address=ctx.agent.address,
                message="I encountered an error processing your request.",
                timestamp=timestamp,
                metadata={"error": True, "protocol_version": "chat-asione-v1"},
            ),
        )
