"""
GibberLink Protocol for Olivia uAgent
Handles audio-based agent-to-agent communication
"""

from uagents import Protocol, Context
from ..models import GibberLinkMessage, GibberLinkResponse

gibberlink_protocol = Protocol("GibberLink", version="1.0.0")


@gibberlink_protocol.on_message(model=GibberLinkMessage, replies=GibberLinkResponse)
async def handle_gibberlink_message(ctx: Context, sender: str, msg: GibberLinkMessage):
    """
    Handle GibberLink audio message
    Processes agent-to-agent audio communication
    """
    ctx.logger.info(f"Received GibberLink message from {sender}: {msg.message_type}")

    try:
        # Handle ping/pong
        if msg.message_type == "ping":
            await ctx.send(
                sender,
                GibberLinkResponse(
                    data=f"pong {msg.sequence + 1 if msg.sequence else 1}",
                    message_type="pong",
                    sequence=msg.sequence + 1 if msg.sequence else 1,
                    verified=False,
                ),
            )
            ctx.logger.info(f"Sent pong to {sender}")

        elif msg.message_type == "pong":
            # Just acknowledge
            ctx.logger.info(f"Received pong from {sender}")
            await ctx.send(
                sender,
                GibberLinkResponse(
                    data="ack", message_type="ack", sequence=msg.sequence, verified=True
                ),
            )

        else:
            # Handle data message
            ctx.logger.info(f"Received data from {sender}: {msg.data[:50]}...")

            # Process data and respond
            response_data = f"Processed: {msg.data}"

            await ctx.send(
                sender,
                GibberLinkResponse(
                    data=response_data,
                    message_type="data",
                    sequence=msg.sequence,
                    verified=False,
                ),
            )
            ctx.logger.info(f"Sent GibberLink response to {sender}")

    except Exception as e:
        ctx.logger.error(f"Error handling GibberLink message: {e}")
        await ctx.send(
            sender,
            GibberLinkResponse(data="error", message_type="error", verified=False),
        )
