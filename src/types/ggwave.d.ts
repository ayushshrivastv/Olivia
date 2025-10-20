/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */

declare module 'ggwave' {
  export interface GGWaveParameters {
    // Add any specific parameters here if known
    [key: string]: any;
  }

  export interface GGWaveInstance {
    // Add any specific instance properties here if known
    [key: string]: any;
  }

  export interface GGWaveModule {
    getDefaultParameters(): GGWaveParameters;
    init(params: GGWaveParameters): GGWaveInstance;
    encode(instance: GGWaveInstance, message: string, protocol: number, volume: number): Int16Array;
    decode(instance: GGWaveInstance, samples: Int16Array): string | null;
    TxProtocolId: {
      GGWAVE_TX_PROTOCOL_AUDIBLE_FAST: number;
      [key: string]: number;
    };
  }

  export default function(): Promise<GGWaveModule>;
}