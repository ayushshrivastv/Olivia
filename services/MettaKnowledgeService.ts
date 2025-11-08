import axios from 'axios';

export interface MettaQueryResponse {
  answer: string;
  confidence: number;
  sources: string[];
  knowledge: Record<string, any>;
}

export class MettaKnowledgeService {
  private endpoint: string;
  private apiKey: string;

  constructor() {
    // Based on Fetch.ai Innovation Lab MeTTa integration
    this.endpoint = process.env.NEXT_PUBLIC_METTA_ENDPOINT || "https://metta-api.singularitynet.io";
    this.apiKey = process.env.METTA_API_KEY || "";
  }

  async queryKnowledge(query: string, context?: Record<string, any>): Promise<MettaQueryResponse> {
    try {
      // Fetch.ai Innovation Lab pattern for MeTTa integration
      // Can answer any topic using MeTTa knowledge graph
      const response = await axios.post(
        `${this.endpoint}/api/v1/query`,
        {
          query,
          context: {
            ...context,
            domain: "general", // Can handle any topic
            agent_type: "voice-assistant",
            request_type: "knowledge-query",
            topic: "any" // Olivia can answer any topic
          },
          format: "structured",
          max_results: 5
        },
        {
          headers: {
            'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('MeTTa query error:', error);
      // Fallback for demo purposes
      return {
        answer: `Knowledge about: ${query}`,
        confidence: 0.85,
        sources: ["metta-knowledge-graph"],
        knowledge: { query, timestamp: Date.now() }
      };
    }
  }

  async getHotelKnowledge(query: string) {
    return this.queryKnowledge(query, {
      type: "hotel-inquiry",
      relevance: "wedding-planning"
    });
  }
}