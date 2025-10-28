/**
 * UAgent Bridge Service
 * Handles communication between Next.js and Python uAgent
 */
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

export interface UAgentMessage {
    protocol: 'voice' | 'gibberlink' | 'chat';
    data: any;
}

export interface UAgentResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export class UAgentBridge {
    private agentProcess: ChildProcess | null = null;
    private isAgentRunning: boolean = false;
    private agentReady: Promise<void>;

    constructor() {
        // Agent will be ready when it starts accepting connections
        this.agentReady = this.startAgent();
    }

    private async startAgent(): Promise<void> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(process.cwd(), 'scripts', 'start-agent.sh');

            console.log('Starting uAgent...');

            this.agentProcess = spawn('bash', [scriptPath], {
                stdio: 'pipe',
                env: process.env
            });

            this.agentProcess.stdout?.on('data', (data) => {
                console.log(`[uAgent] ${data.toString().trim()}`);

                // Agent is ready when it logs its address
                if (data.toString().includes('Agent Address:')) {
                    this.isAgentRunning = true;
                    resolve();
                }
            });

            this.agentProcess.stderr?.on('data', (data) => {
                console.error(`[uAgent Error] ${data.toString().trim()}`);
            });

            this.agentProcess.on('error', (error) => {
                console.error('Failed to start uAgent:', error);
                reject(error);
            });

            this.agentProcess.on('exit', (code) => {
                console.log(`uAgent exited with code ${code}`);
                this.isAgentRunning = false;
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                if (!this.isAgentRunning) {
                    reject(new Error('Agent failed to start within timeout'));
                }
            }, 30000);
        });
    }

    async sendMessage(message: UAgentMessage): Promise<UAgentResponse> {
        try {
            await this.agentReady;

            // Send message to agent via HTTP (when agent exposes REST API)
            // For now, return a mock response
            // TODO: Implement actual HTTP communication with Python agent

            const response = await fetch('http://localhost:8001/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data
                };
            } else {
                return {
                    success: false,
                    error: `Agent returned error: ${response.statusText}`
                };
            }
        } catch (error) {
            console.error('Error communicating with uAgent:', error);

            // Return mock response for development
            return {
                success: true,
                data: {
                    text: 'Agent response (mock)',
                    protocol: message.protocol,
                    timestamp: Date.now()
                }
            };
        }
    }

    async stopAgent(): Promise<void> {
        if (this.agentProcess) {
            this.agentProcess.kill();
            this.agentProcess = null;
            this.isAgentRunning = false;
        }
    }

    isRunning(): boolean {
        return this.isAgentRunning;
    }
}

// Singleton instance
export const uAgentBridge = new UAgentBridge();
