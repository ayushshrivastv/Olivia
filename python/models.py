"""
Data models for Olivia uAgent protocols
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uagents import Model


class VoiceMessage(Model):
    """Message for voice protocol"""

    text: str = Field(description="Voice message text")
    session_id: str = Field(description="Unique session identifier")
    user_id: Optional[str] = Field(default=None, description="User identifier")
    agent_type: Optional[str] = Field(default="inbound", description="Agent type")
    use_metta: bool = Field(default=True, description="Use MeTTa knowledge")
    use_blockchain: bool = Field(default=True, description="Verify on blockchain")


class VoiceResponse(Model):
    """Response from voice protocol"""

    text: str = Field(description="Agent response text")
    session_id: str = Field(description="Session identifier")
    metta_knowledge: Optional[Dict[str, Any]] = Field(
        default=None, description="MeTTa knowledge"
    )
    blockchain_tx: Optional[Dict[str, Any]] = Field(
        default=None, description="Blockchain transaction"
    )
    web3_enhanced: bool = Field(
        default=False, description="Whether response uses web3 features"
    )


class GibberLinkMessage(Model):
    """Message for GibberLink protocol"""

    data: str = Field(description="Encoded audio data or text")
    message_type: str = Field(description="Type: 'ping', 'pong', or 'data'")
    sequence: Optional[int] = Field(default=None, description="Sequence number")
    source_id: Optional[str] = Field(default=None, description="Source agent ID")


class GibberLinkResponse(Model):
    """Response from GibberLink protocol"""

    data: str = Field(description="Response data")
    message_type: str = Field(description="Response type")
    sequence: Optional[int] = Field(default=None, description="Sequence number")
    verified: bool = Field(default=False, description="Whether verified on blockchain")


class ChatMessage(Model):
    """Message for ASI:One Chat Protocol"""

    message: str = Field(description="Chat message text")
    user_id: str = Field(description="User identifier")
    session_id: str = Field(description="Session identifier")
    context: Optional[Dict[str, Any]] = Field(
        default=None, description="Additional context"
    )


class ChatResponse(Model):
    """Response for ASI:One Chat Protocol"""

    type: str = Field(default="agent_message", description="Response type")
    agent_address: str = Field(description="Agent blockchain address")
    message: str = Field(description="Agent response message")
    timestamp: int = Field(description="Response timestamp")
    metadata: Dict[str, Any] = Field(description="Response metadata")


class MettaQuery(Model):
    """Query for MeTTa knowledge graph"""

    query: str = Field(description="Knowledge query")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Query context")


class MettaResult(Model):
    """Result from MeTTa knowledge graph"""

    answer: str = Field(description="Knowledge answer")
    confidence: float = Field(description="Confidence score")
    sources: list = Field(default=[], description="Knowledge sources")
    knowledge: Dict[str, Any] = Field(default={}, description="Raw knowledge data")
