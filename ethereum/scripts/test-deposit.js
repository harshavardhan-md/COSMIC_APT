const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing CosmicPool deposit functionality...\n");

  // Get contract address from deployment
  const fs = require('fs');
  let contractAddress;
  
  try {
    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
    contractAddress = deployment.address;
    console.log("📍 Using deployed contract:", contractAddress, "\n");
  } catch (err) {
    console.error("❌ No deployment.json found. Deploy first!");
    process.exit(1);
  }

  // Connect to contract
  const CosmicPool = await hre.ethers.getContractFactory("CosmicPool");
  const cosmicPool = CosmicPool.attach(contractAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Testing with account:", signer.address);
  
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Generate random secret (32 bytes)
  const secret = hre.ethers.randomBytes(32);
  const secretHex = hre.ethers.hexlify(secret);
  console.log("🔐 Generated secret:", secretHex);

  // Calculate commitment (hash of secret)
  const commitment = hre.ethers.keccak256(secret);
  console.log("📋 Commitment (hash):", commitment, "\n");

  // Check deposit amount
  const depositAmount = await cosmicPool.DEPOSIT_AMOUNT();
  console.log("💵 Required deposit:", hre.ethers.formatEther(depositAmount), "ETH");

  // Make deposit
  console.log("📤 Sending deposit transaction...");
  const tx = await cosmicPool.deposit(commitment, {
    value: depositAmount
  });
  
  console.log("⏳ Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber, "\n");

  // Verify deposit
  const hasCommitment = await cosmicPool.hasCommitment(commitment);
  console.log("🔍 Commitment stored:", hasCommitment);

  const depositCount = await cosmicPool.getDepositCount();
  console.log("📊 Total deposits:", depositCount.toString());

  const contractBalance = await cosmicPool.getBalance();
  console.log("💰 Contract balance:", hre.ethers.formatEther(contractBalance), "ETH\n");

  // Save secret for testing withdrawal later
  const testData = {
    secret: secretHex,
    commitment: commitment,
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    'test-deposit.json',
    JSON.stringify(testData, null, 2)
  );
  
  console.log("💾 Secret saved to test-deposit.json (for Phase 3 withdrawal test)");
  console.log("\n🎉 Deposit test successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });