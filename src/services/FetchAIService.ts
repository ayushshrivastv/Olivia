import { SigningStargateClient, GasPrice } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export class FetchAIBlockchainService {
  private client: SigningStargateClient | null = null;
  private wallet: DirectSecp256k1HdWallet | null = null;
  private address: string = "";

  async initialize() {
    const mnemonic = process.env.FETCHAI_MNEMONIC || "";
    const rpcEndpoint = process.env.NEXT_PUBLIC_FETCHAI_TESTNET_RPC || "";
    
    if (!mnemonic || !rpcEndpoint) {
      console.warn("Fetch.ai credentials not configured");
      return;
    }

    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "fetch"
    });
    
    const [firstAccount] = await this.wallet.getAccounts();
    this.address = firstAccount.address;
    
    this.client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      this.wallet,
      { gasPrice: GasPrice.fromString("5000000000afet") }
    );
  }

  async verifyVoiceInteraction(sessionId: string, agentType: string, message: string) {
    if (!this.client) await this.initialize();
    
    if (!this.client) {
      // Fallback for demo purposes
      return {
        txHash: `demo_${sessionId}_${Date.now()}`,
        height: 0,
        verified: true,
        demo: true
      };
    }

    const memo = JSON.stringify({
      type: "gibberlink-voice-interaction",
      sessionId,
      agentType,
      message: message.substring(0, 100),
      timestamp: Date.now()
    });

    const result = await this.client!.sendTokens(
      this.address,
      this.address,
      [{ denom: "afet", amount: "1" }],
      "auto",
      memo
    );

    return {
      txHash: result.transactionHash,
      height: result.height,
      verified: result.code === 0
    };
  }

  async getAgentAddress() {
    if (!this.address) await this.initialize();
    return this.address || "demo-address";
  }
}