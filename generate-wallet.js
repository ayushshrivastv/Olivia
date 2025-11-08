// Quick wallet generator for Fetch.ai testnet
// Run with: node generate-wallet.js

const crypto = require('crypto');
const bip39 = require('bip39');

async function generateWallet() {
  // Generate random mnemonic
  const mnemonic = bip39.generateMnemonic();
  
  console.log('\n=== Fetch.ai Testnet Wallet ===\n');
  console.log('Your Mnemonic (keep this safe!):');
  console.log(mnemonic);
  console.log('\nAdd this to your .env file:');
  console.log(`FETCHAI_MNEMONIC="${mnemonic}"\n`);
  console.log('⚠️  Keep this mnemonic secret and never share it!');
}

generateWallet().catch(console.error);

