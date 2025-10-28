# Olivia - AI Voice Assistant

An advanced voice-based AI assistant demonstrating the Artificial Superintelligence Alliance ecosystem.

## 🎤 Features

- **Pure Voice Interface** - Speech-to-speech conversation (no text input)
- **ElevenLabs Integration** - Natural voice interaction
- **GibberLink Protocol** - Audio-based agent-to-agent communication
- **MeTTa Knowledge Graph** - SingularityNET knowledge integration
- **Fetch.ai Blockchain** - Immutable verification of interactions
- **Agentverse Registration** - Discoverable on ASI network
- **Beautiful UI** - 3D orb visualization, real-time transcripts

## 🏗️ Architecture

### Voice Flow
```
User speaks → ElevenLabs → Text → /app/api/chat
                               → Enhanced with MeTTa + Fetch.ai
                               → Response → ElevenLabs → User hears
```

### Backend Services
- **ElevenLabs**: Voice conversation
- **OpenAI**: LLM responses
- **MeTTa**: Knowledge graph queries
- **Fetch.ai**: Blockchain verification
- **Python uAgent**: Agentverse registration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `example.env` to `.env` and add your API keys:

```env
# Voice AI
XI_API_KEY="your_elevenlabs_key"
NEXT_PUBLIC_INBOUND_AGENT_ID="your_agent_id"

# LLM
OPENAI_API_KEY="your_openai_key"

# ASI Alliance
METTA_API_KEY="your_metta_key"
FETCHAI_MNEMONIC="your_mnemonic"
AGENTVERSE_MAILBOX_KEY="your_mailbox_key"
UAGENT_SEED="your_seed_phrase"
```

### 3. Run

```bash
# Start Next.js frontend
npm run dev

# In another terminal, start Python agent (for Agentverse)
python python/olivia_agent.py
```

Visit http://localhost:3003

## 🎯 Hackathon Integration

Built for ASI Alliance Hackathon featuring:
- ✅ uAgents framework (Fetch.ai)
- ✅ MeTTa knowledge graph (SingularityNET)
- ✅ Fetch.ai blockchain verification
- ✅ Agentverse deployment
- ✅ GibberLink protocol for agent-to-agent communication

## 📁 Project Structure

```
Olivia/
├── app/                    # Next.js frontend
│   ├── api/               # API routes
│   │   ├── chat/         # Voice conversation endpoint
│   │   ├── agentverse/   # Agent registration
│   │   └── signed-url/   # ElevenLabs sessions
│   └── page.tsx          # Main page
├── components/            # React components
│   ├── ConversationInterface.tsx
│   └── VoiceChatTranscript.tsx
├── python/                # uAgent backend
│   ├── olivia_agent.py
│   ├── protocols/
│   └── services/
└── services/              # Business logic
    ├── FetchAIService.ts
    └── MettaKnowledgeService.ts
```

## 🔧 Environment Variables

Required for full functionality:

### Voice & AI
- `XI_API_KEY` - ElevenLabs voice AI
- `OPENAI_API_KEY` - OpenAI LLM
- `NEXT_PUBLIC_INBOUND_AGENT_ID` - ElevenLabs agent

### ASI Alliance
- `METTA_API_KEY` - SingularityNET MeTTa
- `FETCHAI_MNEMONIC` - Fetch.ai wallet
- `AGENTVERSE_MAILBOX_KEY` - Agentverse connectivity
- `UAGENT_SEED` - Deterministic agent address

## 📚 Documentation

- `INTEGRATION_SUMMARY.md` - Complete integration details
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `AGENTVERSE_SETUP.md` - Agentverse registration guide

## 🎨 Usage

1. Click "Start conversation"
2. Speak to Olivia
3. View conversation in transcript
4. See blockchain verification status
5. MeTTa knowledge enhances responses

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Fetch.ai for uAgents framework
- SingularityNET for MeTTa knowledge graph
- ElevenLabs for voice AI
- ASI Alliance for bringing these technologies together

---

Built for the **ASI Alliance Hackathon 2024**

