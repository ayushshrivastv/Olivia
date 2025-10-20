# Setup Instructions

## ⚠️ IMPORTANT: Create .env File

You need to manually create the `.env` file from `example.env`:

### Steps:
1. In your IDE, right-click on the `Olivia` folder
2. Select "New File"
3. Name it exactly: `.env` (including the dot at the start)
4. Copy the entire contents from `example.env` into `.env`
5. Save the file

### OR use terminal command:
```bash
cd /Users/ayushsrivastava/gibberlink/Olivia
cp example.env .env
```

### After creating .env:
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## Why .env file is needed

The `.env` file contains your API keys:
- ElevenLabs API key
- OpenAI API key
- Fetch.ai wallet mnemonic
- Agentverse (ASI:One) API key
- MeTTa configuration

Without this file, the app can't connect to the external services!

