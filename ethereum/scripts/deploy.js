const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CosmicPool to Sepolia...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying from:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy contract
  const CosmicPool = await hre.ethers.getContractFactory("CosmicPool");
  const cosmicPool = await CosmicPool.deploy();
  
  await cosmicPool.waitForDeployment();
  
  const address = await cosmicPool.getAddress();
  console.log("✅ CosmicPool deployed to:", address);
  console.log("📊 Deposit amount:", hre.ethers.formatEther(await cosmicPool.DEPOSIT_AMOUNT()), "ETH");
  console.log("👤 Owner:", await cosmicPool.owner());
  
  console.log("\n🔍 Verify contract on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${address}`);
  
  console.log("\n📝 Save this address for Phase 2 (Bridge)!");
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: "sepolia",
    contract: "CosmicPool",
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    depositAmount: "0.0001 ETH"
  };
  
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });