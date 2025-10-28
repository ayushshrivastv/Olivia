"""
Olivia AI Voice Assistant - uAgent Implementation
Integrates with ASI Alliance: Fetch.ai, SingularityNET, and Agentverse
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from uagents import Agent, Context
from uagents.setup import fund_agent_if_low

# Load environment variables
load_dotenv()

# Import protocols
from protocols.voice_protocol import voice_protocol
from protocols.gibberlink_protocol import gibberlink_protocol
from protocols.chat_protocol import chat_protocol

# Configuration
AGENT_NAME = os.getenv("UAGENT_NAME", "olivia")
UAGENT_SEED = os.getenv("UAGENT_SEED", "olivia secure seed phrase")
UAGENT_PORT = int(os.getenv("UAGENT_PORT", "8001"))
AGENTVERSE_MAILBOX_KEY = os.getenv("AGENTVERSE_MAILBOX_KEY", "")

# Create agent
# If using Mailbox, endpoint is empty. Otherwise, set to your public URL
AGENT_ENDPOINT = os.getenv("AGENT_ENDPOINT", "")

olivia = Agent(
    name=AGENT_NAME,
    seed=UAGENT_SEED,
    port=UAGENT_PORT,
    endpoint=[AGENT_ENDPOINT] if AGENT_ENDPOINT else [],  # Leave empty for Mailbox
    mailbox=AGENTVERSE_MAILBOX_KEY if AGENTVERSE_MAILBOX_KEY else True,
    publish_agent_details=True,
)

# Include protocols
olivia.include(voice_protocol)
olivia.include(gibberlink_protocol)
olivia.include(chat_protocol)


@olivia.on_event("startup")
async def startup_event(ctx: Context):
    """Initialize agent on startup"""
    ctx.logger.info(f"🎤 Olivia AI Voice Assistant started!")
    ctx.logger.info(f"📍 Agent Address: {olivia.address}")
    ctx.logger.info(f"🔗 Protocols: Voice, GibberLink, Chat")

    # Fund agent if low on tokens
    await fund_agent_if_low(str(olivia.wallet.address()))


@olivia.on_interval(period=3600.0)  # Every hour
async def heartbeat(ctx: Context):
    """Periodic heartbeat to stay registered"""
    ctx.logger.info(f"💓 Olivia heartbeat - Address: {olivia.address}")


@olivia.on_interval(period=60.0)  # Every minute
async def discover_agents(ctx: Context):
    """Periodically discover other agents"""
    # Query Almanac for agents with specific capabilities
    # This is a placeholder - actual implementation would query Almanac
    # agents = await ctx.almanac.query_agents(capability="voice", protocol="gibberlink")
    # ctx.storage.set("available_agents", agents)


if __name__ == "__main__":
    print(
        f"""
{'='*60}
    🎤 Olivia AI Voice Assistant
{'='*60}
Name: {AGENT_NAME}
Address: {olivia.address}
Protocols: Voice, GibberLink, Chat (ASI:One)
{'='*60}
Starting agent...
    """
    )

    olivia.run()
