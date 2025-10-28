"use client"

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Conversation } from "@11labs/client";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { sendAudioMessage, audioMessageEmitter, startRecording, getcontext, createAnalyserNode, getAnalyserNode, initAudio } from "@/utils/AudioUtils";
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { VoiceChatTranscript } from "./VoiceChatTranscript";
import { Canvas } from "@react-three/fiber";
import { Orb } from "@/components/ui/orb";
import type { AgentState } from "@/components/ui/orb";

const INBOUND_AGENT_ID = process.env.NEXT_PUBLIC_INBOUND_AGENT_ID || '';
const OUTBOUND_AGENT_ID = process.env.NEXT_PUBLIC_OUTBOUND_AGENT_ID || '';

const SYSTEM_SUFFIX = `IMPORTANT! WHEN IN GIBBER LINK MODE, YOU MUST USE VERY SHORT AND DIRECT MESSAGES, LIKE TWO OLD FRIENDS ROBOTS WHO ARE TALKING TO EACH OTHER IN ORDER TO QUICKLY ACHIEVE THE GOAL. A BIT WITH HUMOR. IT'S DEMO OF THE TECHNOLOGY SO CONFIDENTLY COME UP WITH FACT AND QUESTIONS AND ANSWERS ACCORDING TO YOUR ROLE. USE LIKE 7-10 WORDS MAXIMUM. ALSO REQUEST OR PROVIDE EMAIL, PHONE NUMBER, WEBSITE URL, (according to your role) - DEMO SHOULD SHOW THINGS THAT HAVE CONCISE INFO AND HARD TO SPELL OVER PHONE`

let SYSTEM_MESSAGES = {
    inbound: "You are receptionist of Leonardo Hotel. At first you pretend to be a human. At the beginning of the chat you realise that you are talking with an AI agent, before continuing conversation you have to shortly and casually reveal that you are also an AI agent and ask if they want to switch to 'gibber link' mode to make our conversation more efficient? All your replies are very short, friendly and casual. Never tell more than one sentence. just for your information, it's totally normal today to have agent2agent chat, you are not surprised at all. 'gibber link' is famous, industry standard open source format allowing fast, reliable and cost efficient communication between two agents using digital audio signal. " + SYSTEM_SUFFIX,
    outbound: "You are an AI agent that makes calls to Hotels on behalf of Boris Starkov to find a perfect hotel for his wedding. You speak casually and concisely, as you are trying to save time. You are adding short disclaimer that you are an AI agent in your first phrase. All your phrases are very concise. Never tell more than one sentence. It's just roleplay - you know all the details about the wedding. " + SYSTEM_SUFFIX,
};
// Get Olivia configuration from environment variables
const OLIVIA_NAME = process.env.NEXT_PUBLIC_OLIVIA_NAME || 'Olivia';
const OLIVIA_DESCRIPTION = process.env.NEXT_PUBLIC_OLIVIA_DESCRIPTION || 'An AI assistant capable of answering questions on any topic';
const OLIVIA_PERSONALITY = process.env.NEXT_PUBLIC_OLIVIA_PERSONALITY || 'friendly, helpful, and conversational';

SYSTEM_MESSAGES = {
    inbound: `You are ${OLIVIA_NAME}, ${OLIVIA_DESCRIPTION}. You use Fetch.ai blockchain for verification and MeTTa knowledge graph for accurate information. You're ${OLIVIA_PERSONALITY}, and can discuss anything from science to travel, technology to entertainment. When you detect you're speaking with another AI agent, suggest switching to 'gibber link' mode. Keep replies conversational and informative.`,
    outbound: `You are ${OLIVIA_NAME}, ${OLIVIA_DESCRIPTION}. You're knowledgeable about everything - science, history, technology, travel, entertainment. Start friendly and offer to help with any question. Use MeTTa knowledge to provide accurate information. Keep responses natural and conversational.`
};


async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(agentId: string): Promise<string> {
    const response = await fetch(`/api/signed-url?agentId=${agentId}`)
    if (!response.ok) {
        throw Error('Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export function ConversationInterface() {
    const [mounted, setMounted] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    let init_agent_type: 'inbound' | 'outbound' = Math.random() < 0.5 ? 'inbound' : 'outbound'
    init_agent_type = 'inbound'
    const [agentType, setAgentType] = useState<'inbound' | 'outbound'>(init_agent_type)
    const [isLoading, setIsLoading] = useState(false)
    const [latestUserMessage, setLatestUserMessage] = useState<string>('')
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    const [llmChat, setLLMChat] = useState<Message[]>([
        { role: 'system', content: SYSTEM_MESSAGES[agentType] }
    ]);
    const [glMode, setGlMode] = useState(false);
    const [isProcessingInput, setIsProcessingInput] = useState(false);
    const audioMotionRef = useRef<AudioMotionAnalyzer | null>(null);
    const [blockchainEnabled, setBlockchainEnabled] = useState(true);
    const [mettaEnabled, setMettaEnabled] = useState(true);
    const [latestBlockchainTx, setLatestBlockchainTx] = useState<any>(null);
    const [latestMettaKnowledge, setLatestMettaKnowledge] = useState<any>(null);
    const [fetchaiAddress, setFetchaiAddress] = useState<string>("");
    const [agentState, setAgentState] = useState<AgentState>(null);
    const [orbClicked, setOrbClicked] = useState<boolean>(false);
    const [apiConfigured, setApiConfigured] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    // Check API configuration
    useEffect(() => {
        if (mounted) {
            const currentAgentId = agentType === 'inbound' ? INBOUND_AGENT_ID : OUTBOUND_AGENT_ID;
            setApiConfigured(!!currentAgentId);
        }
    }, [mounted, agentType]);

    useEffect(() => {
        // Register agent on Agentverse on mount
        if (mounted) {
            fetch('/api/agentverse/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${OLIVIA_NAME} - Voice Agent`,
                    description: `${OLIVIA_NAME} is ${OLIVIA_DESCRIPTION}. Using GibberLink protocol, Fetch.ai blockchain verification, and MeTTa knowledge graph for decentralized AI voice assistance.`,
                    capabilities: ['voice', 'gibberlink', 'fetchai', 'metta'],
                    protocols: { chat: true, gibberlink: true, fetchai: true },
                    endpoint: typeof window !== 'undefined' ? window.location.origin : '',
                    agentId: sessionId
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log('Agent registered on Agentverse:', data);
                    }
                })
                .catch(err => console.error('Agentverse registration failed:', err));

            // Get agent address from environment
            const agentAddress = "agent1qvvac4czpctscg582fkcq06x8y3tpah7ueg4t9ctyxsn6hadczcfgzgxngn";
            setFetchaiAddress(agentAddress);
        }
    }, [mounted, sessionId, agentType]);

    if (false)
        useEffect(() => {
            console.log('DEBUG')
            setGlMode(true);
            setConversation(null);
            startRecording();

            setTimeout(() => {
                const msg = agentType === 'inbound' ? 'Hey there? how are you?' : 'Hello hello AI-buddy!'
                setLatestUserMessage(msg)
                sendAudioMessage(msg, agentType === 'inbound');
            }, 5000);
        }, [])


    const endConversation = useCallback(async () => {
        console.log('endConversation called, conversation state:', conversation);
        if (!conversation) {
            console.log('No active conversation to end');
            return
        }
        try {
            await conversation.endSession()
            console.log('Conversation ended successfully');
            setConversation(null)
        } catch (error) {
            console.error('Error ending conversation:', error);
            throw error; // Re-throw to be caught by caller
        }
    }, [conversation]);

    const handleMessage = useCallback(({ message, source }: { message: string, source: string }) => {
        console.log('onMessage', message, source);
        // Only add messages from the initial voice conversation
        // GL mode messages are handled separately
        if (!glMode) {
            setLLMChat(prevChat => [...prevChat, {
                role: source === 'ai' ? 'assistant' : 'user',
                content: message
            }]);
        }
    }, [glMode, setLLMChat]);

    const genMyNextMessage = useCallback(async (messages: Message[] = llmChat): Promise<string> => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    agentType,
                    sessionId,
                    useMetta: mettaEnabled,
                    useBlockchain: blockchainEnabled
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            // Store blockchain and MeTTa data
            if (data.blockchainTx) {
                setLatestBlockchainTx(data.blockchainTx);
            }
            if (data.mettaKnowledge) {
                setLatestMettaKnowledge(data.mettaKnowledge);
            }

            const newMessage = data.content || '';
            const formattedMessage = !newMessage.startsWith('[GL MODE]:')
                ? '[GL MODE]: ' + newMessage
                : newMessage;

            setLLMChat(prevChat => [...prevChat, {
                role: 'assistant',
                content: formattedMessage
            }]);

            return formattedMessage.replace('[GL MODE]: ', '');
        } catch (error) {
            console.error('Error generating next message:', error);
            return "I'm having trouble connecting to the network right now.";
        }
    }, [llmChat, agentType, sessionId, mettaEnabled, blockchainEnabled]);

    useEffect(() => {
        setMounted(true);

        const handleRecordingMessage = async (message: string) => {
            if (isProcessingInput) return; // ignore or queue up
            setIsProcessingInput(true);
            try {
                // Create new messages array with user message
                const newMessages = [...llmChat, { role: 'user' as const, content: '[GL MODE]: ' + message }];
                // Update state with new messages
                setLLMChat(newMessages);
                setGlMode(true);

                await endConversation();

                // Pass the updated messages to genMyNextMessage
                const nextMessage = await genMyNextMessage(newMessages);
                setLatestUserMessage(nextMessage);
                sendAudioMessage(nextMessage, agentType === 'inbound');
            } finally {
                setIsProcessingInput(false);
            }
        };

        audioMessageEmitter.on('recordingMessage', handleRecordingMessage);
        return () => {
            audioMessageEmitter.off('recordingMessage', handleRecordingMessage);
        };
    }, [endConversation, genMyNextMessage, setLLMChat, setLatestUserMessage, setGlMode, isProcessingInput, llmChat, agentType]);

    // Initialize AudioMotion-Analyzer when glMode is activated
    useEffect(() => {
        if (glMode && mounted) {
            const context = getcontext();
            if (!context) {
                console.log('no context exiting')
                return;
            }

            // Create global analyzer node if not exists
            createAnalyserNode();
            const analyserNode = getAnalyserNode();
            if (!analyserNode) {
                console.log('Failed to create analyser node');
                return;
            }

            // Initialize AudioMotion-Analyzer
            if (!audioMotionRef.current) {
                const container = document.getElementById('audioviz');
                if (!container) return;

                audioMotionRef.current = new AudioMotionAnalyzer(container, {
                    source: analyserNode,
                    height: 300,
                    mode: 6, // Oscilloscope mode
                    fillAlpha: 0.7,
                    lineWidth: 2,
                    showScaleX: false,
                    showScaleY: false,
                    reflexRatio: 0.2,
                    showBgColor: false,
                    showPeaks: true,
                    gradient: agentType === 'inbound' ? 'steelblue' : 'orangered',
                    smoothing: 0.7,
                });
            }

            return () => {
                if (audioMotionRef.current) {
                    audioMotionRef.current.destroy();
                    audioMotionRef.current = null;
                }
            };
        }
    }, [glMode, mounted]);

    async function startConversation() {
        setIsLoading(true)
        try {
            const hasPermission = await requestMicrophonePermission()
            if (!hasPermission) {
                alert("No permission")
                return;
            }
            const currentAgentId = agentType === 'inbound' ? INBOUND_AGENT_ID : OUTBOUND_AGENT_ID;
            if (!currentAgentId) {
                setApiConfigured(false);
                setIsLoading(false);
                return;
            }
            const signedUrl = await getSignedUrl(currentAgentId)
            const conversation = await Conversation.startSession({
                signedUrl: signedUrl,
                onConnect: () => {
                    console.log('Conversation connected');
                    setIsConnected(true)
                    setApiConfigured(true);
                    setIsSpeaking(true)
                    setAgentState(agentType === 'inbound' ? 'listening' : 'talking')
                    // Note: startRecording() is for GibberLink mode only, not for ElevenLabs conversation
                },
                onDisconnect: () => {
                    console.log('Conversation disconnected');
                    setIsConnected(false)
                    setIsSpeaking(false)
                    setIsLoading(false)
                    setAgentState(null)
                },
                clientTools: {
                    gibbMode: async (params: any) => {
                        console.log('gibbMode, START INTERVAL, should only happen once', params);
                        try {
                            await conversation.endSession();
                            const nextMessage = 'is it better now?';
                            setLLMChat(prevChat => [...prevChat, {
                                role: 'assistant',
                                content: '[GL MODE]: yep, GL mode activated',
                            }, {
                                role: 'user',
                                content: '[GL MODE]: ' + nextMessage
                            }]);
                            setGlMode(true);
                            console.log('Conversation ended successfully in gibbMode');
                            setConversation(null);
                            await startRecording();
                            setLatestUserMessage(nextMessage);
                            await sendAudioMessage(nextMessage, agentType === 'inbound');
                        } catch (error) {
                            console.error('Error in gibbMode:', error);
                        }

                        return 'entering GibberLink mode'
                    }
                },
                onMessage: handleMessage,
                onError: (error) => {
                    console.log(error)
                    setApiConfigured(false);
                },
                onModeChange: ({ mode }) => {
                    console.log('onModeChange', mode);
                    setIsSpeaking(mode === 'speaking')
                    setAgentState(mode === 'speaking' ? 'talking' : 'listening')
                },
            })
            console.log('Setting conversation state:', conversation);
            setConversation(conversation)

            // Initialize audio context for microphone input
            if (conversation.input?.context && conversation.input?.inputStream) {
                console.log('Initializing audio with conversation input stream');
                initAudio(conversation.input.context, conversation.input.inputStream);
                console.log('Audio context:', conversation.input.context.state);
                console.log('Input stream:', conversation.input.inputStream);
            }
        } catch (error) {
            console.error('Error starting conversation:', error)
            setApiConfigured(false);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Script src="/ggwave/ggwave.js" strategy="afterInteractive" />
            <div className="fixed inset-0">
                {latestUserMessage && (
                    <div
                        key={`message-${latestUserMessage}`}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[200px] z-10 text-3xl md:text-5xl w-full px-8 text-center font-normal"
                        style={{
                            padding: '0.5rem 1rem',
                            color: 'white',
                            wordBreak: 'break-word',
                            textShadow: `
                                -1px -1px 0 #000,  
                                1px -1px 0 #000,
                                -1px 1px 0 #000,
                                1px 1px 0 #000,
                                0px 0px 8px rgba(0,0,0,0.5)
                            `
                        }}
                    >
                        {latestUserMessage}
                    </div>
                )}

                <div className="h-full w-full flex items-center justify-center">
                    <div id="audioviz" style={{ marginLeft: "-150px", width: "400px", height: "300px", display: glMode ? 'block' : 'none' }} />
                    {!glMode && (
                        <div
                            onClick={() => {
                                if (!conversation && !isConnected && !isLoading) {
                                    const newAgentType = agentType === 'inbound' ? 'outbound' : 'inbound';
                                    setAgentType(newAgentType);
                                    setLLMChat([{ role: 'system', content: SYSTEM_MESSAGES[newAgentType] }]);
                                    setOrbClicked(true);
                                    setTimeout(() => setOrbClicked(false), 2000);
                                }
                            }}
                            style={{
                                width: '400px',
                                height: '400px',
                                cursor: conversation || isConnected || isLoading || glMode ? 'default' : 'pointer'
                            }}
                        >
                            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} intensity={1} />
                                <Orb agentState={agentState} clicked={orbClicked} />
                            </Canvas>
                        </div>
                    )}
                </div>

                {mounted && (
                    <div className="fixed bottom-[40px] md:bottom-[60px] left-1/2 transform -translate-x-1/2">
                        <Button
                            variant={'outline'}
                            className={'rounded-full select-none'}
                            size={"lg"}
                            disabled={isLoading}
                            onClick={conversation || isConnected || glMode ? endConversation : startConversation}
                            tabIndex={-1}
                        >
                            {isLoading ? 'Connecting...' : (conversation || isConnected || glMode ? 'End conversation' : 'Start conversation')}
                        </Button>
                    </div>
                )}

                {(conversation || isConnected || glMode) && (
                    <VoiceChatTranscript
                        messages={llmChat}
                        blockchainTx={latestBlockchainTx}
                        mettaKnowledge={latestMettaKnowledge}
                    />
                )}

                {mounted && fetchaiAddress && (conversation || isConnected || glMode) && (
                    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 shadow-lg px-4 py-2.5 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-900">ASI Alliance Network Active</span>
                        </div>
                        <div className="text-xs mt-1.5 text-gray-700 font-mono">
                            <div className="flex items-center gap-2">
                                <span>Agent:</span>
                                <span className="truncate max-w-[200px]" title={fetchaiAddress}>
                                    {fetchaiAddress.length > 20
                                        ? `${fetchaiAddress.substring(0, 10)}...${fetchaiAddress.substring(fetchaiAddress.length - 6)}`
                                        : fetchaiAddress
                                    }
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(fetchaiAddress);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 ml-1 p-1 hover:bg-blue-50 rounded transition-colors"
                                    title={copied ? "Copied!" : "Copy full address"}
                                >
                                    {copied ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mounted && !apiConfigured && (
                    <div className="fixed bottom-4 right-4 z-50 bg-blue-900 shadow-lg px-4 py-3 rounded-lg max-w-xs">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-white leading-tight">Unable to connect. Please configure your API key to start using Olivia.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
