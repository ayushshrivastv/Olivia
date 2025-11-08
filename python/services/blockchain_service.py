"""
Fetch.ai Blockchain Service
Handles blockchain verification on Fetch.ai testnet
"""

import os
from typing import Dict, Any, Optional
from ..models import VoiceMessage


class BlockchainService:
    """Service for Fetch.ai blockchain interactions"""

    def __init__(self):
        self.rpc_endpoint = os.getenv(
            "NEXT_PUBLIC_FETCHAI_TESTNET_RPC", "https://rpc-dorado.fetch.ai:443"
        )
        self.mnemonic = os.getenv("FETCHAI_MNEMONIC", "")

    async def verify_voice_interaction(
        self, session_id: str, agent_type: str, message: str
    ) -> Optional[Dict[str, Any]]:
        """
        Verify a voice interaction on Fetch.ai blockchain

        Returns a mock transaction for now.
        TODO: Implement actual blockchain transaction using CosmJS
        """
        if not self.mnemonic:
            # Return demo transaction if not configured
            return {
                "txHash": f"demo_{session_id}_{hash(message) % 1000000}",
                "height": 0,
                "verified": True,
                "demo": True,
            }

        # TODO: Implement actual blockchain transaction
        # This would use CosmJS to send a transaction with memo containing:
        # - type: "gibberlink-voice-interaction"
        # - sessionId
        # - agentType
        # - message (first 100 chars)
        # - timestamp

        return {
            "txHash": f"fetch_{session_id}_{hash(message) % 1000000}",
            "height": 0,
            "verified": True,
            "demo": False,
        }

    def get_agent_address(self) -> str:
        """Get the Fetch.ai agent address"""
        # TODO: Derive from mnemonic using CosmJS
        return os.getenv("FETCHAI_AGENT_ADDRESS", "agent1q...")
