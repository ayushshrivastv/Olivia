import axios from 'axios';

export interface AgentProfile {
  name: string;
  description: string;
  capabilities: string[];
  protocols: {
    chat: boolean;
    gibberlink: boolean;
    fetchai: boolean;
  };
  endpoint: string;
  agentId: string;
}

export class AgentverseService {
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    this.apiEndpoint = process.env.NEXT_PUBLIC_AGENTVERSE_API || "";
    this.apiKey = process.env.AGENTVERSE_API_KEY || "";
  }

  async registerAgent(profile: AgentProfile) {
    // Fallback to demo mode if API endpoint is not configured
    if (!this.apiEndpoint || this.apiEndpoint === "") {
      console.warn("Agentverse API endpoint not configured, using demo mode");
      return {
        success: true,
        agentId: profile.agentId,
        registered: true,
        demo: true
      };
    }

    try {
      const response = await axios.post(
        `${this.apiEndpoint}/agents`,
        {
          ...profile,
          chat_protocol_enabled: true,
          registration_timestamp: Date.now()
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        agentId: response.data.agent_id,
        registered: true
      };
    } catch (error: any) {
      console.warn('Agentverse registration failed (service may not be available):', error?.response?.status || error?.message);
      // Return success to prevent UI errors - agent works without Agentverse
      return {
        success: true,
        agentId: profile.agentId,
        registered: false,
        demo: true
      };
    }
  }

  async discoverAgents(capability?: string) {
    try {
      const params = capability ? { capability } : {};
      const response = await axios.get(
        `${this.apiEndpoint}/agents/discover`,
        {
          params,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.agents || [];
    } catch (error) {
      console.error('Agent discovery error:', error);
      return [];
    }
  }
}

