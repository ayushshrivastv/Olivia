# Olivia - AI Voice Assistant

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3) ![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

## Overview

Olivia is an advanced voice-based AI assistant that demonstrates the capabilities of the Artificial Superintelligence Alliance ecosystem. Built as a comprehensive solution for decentralized AI voice interaction, Olivia integrates multiple cutting-edge technologies to provide a seamless speech-to-speech conversation experience without requiring text input.

The system leverages ElevenLabs for natural voice interaction, enabling users to engage in fluid conversations entirely through voice. All interactions are enhanced through the MeTTa knowledge graph from SingularityNET, providing access to a vast repository of structured knowledge. Every conversation is immutably verified on the Fetch.ai blockchain, ensuring transparency and trust in AI interactions. Additionally, Olivia is discoverable on the ASI network through Agentverse registration, making it part of a larger ecosystem of intelligent agents.

## Architecture

The architecture of Olivia follows a modular design that seamlessly integrates voice processing, artificial intelligence, blockchain verification, and knowledge graph queries. The voice flow begins when a user speaks, which is then processed by ElevenLabs to convert speech to text. This text is sent to the chat API endpoint where it undergoes enhancement through MeTTa knowledge graph queries and Fetch.ai blockchain verification before being processed by the OpenAI language model.

The response generation process involves querying the MeTTa knowledge graph to enrich the conversation with relevant structured knowledge, ensuring that responses are not only contextually appropriate but also backed by verified information. Simultaneously, the interaction is recorded on the Fetch.ai blockchain, providing an immutable record of the conversation. The enhanced response is then converted back to speech through ElevenLabs, allowing for a complete voice-to-voice interaction cycle.

The backend infrastructure consists of multiple specialized services working in harmony. ElevenLabs handles all voice conversation processing, including speech-to-text and text-to-speech conversions. OpenAI provides the core language model capabilities for generating intelligent responses. The MeTTa service enables knowledge graph queries that enhance responses with structured information from SingularityNET's knowledge base. Fetch.ai blockchain service handles all on-chain verification and transaction recording. The Python uAgent implementation manages Agentverse registration and agent-to-agent communication protocols.

## Features

Olivia provides a pure voice interface that eliminates the need for text input, creating an entirely natural conversation experience. Users can interact with the assistant using only their voice, making it accessible and intuitive. The integration with ElevenLabs ensures high-quality voice recognition and synthesis, providing a natural conversation flow that feels authentic and engaging.

The system implements the GibberLink protocol, enabling audio-based agent-to-agent communication. This protocol allows Olivia to communicate with other agents in the network using audio signals, opening up possibilities for decentralized multi-agent interactions. The MeTTa knowledge graph integration provides access to SingularityNET's extensive knowledge repository, ensuring that responses are informed by verified and structured information.

Blockchain verification is a core feature of Olivia, with every interaction being immutably recorded on the Fetch.ai blockchain. This provides transparency and auditability, ensuring that all conversations can be verified and traced. The Agentverse registration makes Olivia discoverable on the ASI network, allowing it to interact with other agents and be discovered by users searching for voice AI capabilities.

The user interface features a beautiful 3D orb visualization that provides visual feedback during conversations, along with real-time transcripts that display the conversation history. The interface is designed to be intuitive and visually appealing, creating an engaging user experience that complements the advanced technical capabilities of the system.

## Installation and Setup

To begin using Olivia, you must first install the necessary dependencies. The project requires both Node.js and Python environments to be set up. Begin by installing the Node.js dependencies using npm install, which will install all frontend and API dependencies including Next.js, React, and various integration libraries. Following this, install the Python dependencies by running pip install -r requirements.txt, which will install the uAgent framework and other backend dependencies.

Configuration of the environment variables is essential for the system to function properly. Copy the example.env file to .env and populate it with your API keys and configuration values. The voice AI configuration requires an ElevenLabs API key and agent ID, which are necessary for voice processing capabilities. The LLM configuration requires an OpenAI API key for language model access.

The ASI Alliance integration requires several additional configuration values. The MeTTa API key enables access to SingularityNET's knowledge graph services. The Fetch.ai mnemonic provides access to your blockchain wallet for transaction signing and verification. The Agentverse mailbox key enables connectivity to the Agentverse network, allowing your agent to be discovered and communicate with other agents. The uAgent seed phrase provides a deterministic way to generate your agent's address, ensuring consistency across deployments.

To run the system, start the Next.js frontend server using npm run dev, which will launch the application on port 3003. In a separate terminal, start the Python agent by running python python/olivia_agent.py, which will initialize the uAgent backend and register the agent on the Agentverse network. Once both services are running, you can access the application by visiting http://localhost:3003 in your web browser.

## Usage

Using Olivia is designed to be straightforward and intuitive. To begin a conversation, simply click the "Start conversation" button on the main interface. Once initiated, you can speak naturally to Olivia, and the system will process your speech, generate an appropriate response enhanced with knowledge from the MeTTa graph, and respond back through voice synthesis.

During the conversation, you can view the real-time transcript that displays both your messages and Olivia's responses. This transcript provides a visual record of the conversation while maintaining the primary voice-based interaction. The system also displays the blockchain verification status, showing when interactions have been successfully recorded on the Fetch.ai blockchain.

The MeTTa knowledge integration works transparently in the background, enhancing responses with relevant information from the knowledge graph. This ensures that Olivia's responses are not only contextually appropriate but also informed by verified knowledge from SingularityNET's repository. The blockchain verification occurs automatically for each interaction, providing an immutable record of the conversation.

## Technical Details

The project structure is organized to maintain clear separation between frontend, backend, and API components. The app directory contains the Next.js frontend application, including API routes for chat processing, agentverse registration, and signed URL generation for ElevenLabs sessions. The components directory houses React components including the ConversationInterface, which manages the main user interaction, and VoiceChatTranscript, which displays the conversation history.

The python directory contains the uAgent backend implementation, including the main olivia_agent.py file that initializes and runs the agent. The protocols directory contains implementations of various communication protocols including voice, GibberLink, and chat protocols. The services directory includes business logic services such as the FetchAI blockchain service and MeTTa knowledge service.

Environment variables play a crucial role in configuring the system. Voice and AI functionality requires the ElevenLabs API key, OpenAI API key, and ElevenLabs agent ID. The ASI Alliance integration requires the MeTTa API key, Fetch.ai mnemonic, Agentverse mailbox key, and uAgent seed phrase. All of these must be properly configured for the system to function at full capacity.

## License

This project is licensed under the MIT License. Please refer to the LICENSE file for complete licensing information.

## Acknowledgments

Olivia represents a collaborative effort that brings together multiple innovative technologies. We extend our gratitude to Fetch.ai for providing the uAgents framework that enables decentralized agent creation and communication. SingularityNET deserves recognition for the MeTTa knowledge graph that provides access to structured knowledge. ElevenLabs has been instrumental in providing high-quality voice AI capabilities. Finally, we acknowledge the ASI Alliance for creating the platform and ecosystem that makes projects like Olivia possible, bringing together these cutting-edge technologies in a unified framework.

---

Built for the **ASI Alliance Hackathon 2024**
