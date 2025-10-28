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
      // Return demo transaction with fake hash
      const fakeHash = `demo_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return {
        txHash: fakeHash,
        height: 0,
        verified: true,
        demo: true,
        explorerUrl: null
      };
    }

    try {
      // Get address for self-transfer
      const recipient = await this.getAgentAddress();

      const memo = JSON.stringify({
        type: "gibberlink-voice-interaction",
        sessionId,
        agentType,
        message: message.substring(0, 100),
        timestamp: Date.now()
      });

      // Send 1 afet to self as verification transaction
      const result = await this.client!.sendTokens(
        this.address,
        recipient,
        [{ denom: "afet", amount: "1" }],
        "auto",
        memo
      );

      // Generate explorer URL for Dorado testnet
      const explorerUrl = `https://explore-dorado.fetch.ai/transactions/${result.transactionHash}`;

      return {
        txHash: result.transactionHash,
        height: result.height,
        verified: result.code === 0,
        explorerUrl,
        demo: false
      };
    } catch (error: any) {
      console.error('Blockchain transaction error:', error);
      // Return demo on error
      return {
        txHash: `error_${Date.now()}`,
        height: 0,
        verified: false,
        demo: true,
        error: error.message,
        explorerUrl: null
      };
    }
  }

  async getAgentAddress() {
    if (!this.address) await this.initialize();
    return this.address || "demo-address";
  }
}