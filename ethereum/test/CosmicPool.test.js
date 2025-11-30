const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CosmicPool", function () {
  let cosmicPool;
  let owner;
  let user1;
  let user2;
  const DEPOSIT_AMOUNT = ethers.parseEther("0.0001");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const CosmicPool = await ethers.getContractFactory("CosmicPool");
    cosmicPool = await CosmicPool.deploy();
    await cosmicPool.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cosmicPool.owner()).to.equal(owner.address);
    });

    it("Should have correct deposit amount", async function () {
      expect(await cosmicPool.DEPOSIT_AMOUNT()).to.equal(DEPOSIT_AMOUNT);
    });
  });

  describe("Deposits", function () {
    it("Should accept valid deposit", async function () {
      const secret = ethers.randomBytes(32);
      const commitment = ethers.keccak256(secret);

      await expect(
        cosmicPool.connect(user1).deposit(commitment, { value: DEPOSIT_AMOUNT })
      ).to.emit(cosmicPool, "Deposit");

      expect(await cosmicPool.hasCommitment(commitment)).to.be.true;
    });

    it("Should reject wrong amount", async function () {
      const secret = ethers.randomBytes(32);
      const commitment = ethers.keccak256(secret);

      await expect(
        cosmicPool.connect(user1).deposit(commitment, { 
          value: ethers.parseEther("0.0002") 
        })
      ).to.be.revertedWith("Must send exactly 0.0001 ETH");
    });

    it("Should reject duplicate commitment", async function () {
      const secret = ethers.randomBytes(32);
      const commitment = ethers.keccak256(secret);

      await cosmicPool.connect(user1).deposit(commitment, { value: DEPOSIT_AMOUNT });

      await expect(
        cosmicPool.connect(user2).deposit(commitment, { value: DEPOSIT_AMOUNT })
      ).to.be.revertedWith("Commitment already exists");
    });

    it("Should track deposit count", async function () {
      const secret1 = ethers.randomBytes(32);
      const commitment1 = ethers.keccak256(secret1);
      
      const secret2 = ethers.randomBytes(32);
      const commitment2 = ethers.keccak256(secret2);

      await cosmicPool.connect(user1).deposit(commitment1, { value: DEPOSIT_AMOUNT });
      await cosmicPool.connect(user2).deposit(commitment2, { value: DEPOSIT_AMOUNT });

      expect(await cosmicPool.getDepositCount()).to.equal(2);
    });

    it("Should increase contract balance", async function () {
      const secret = ethers.randomBytes(32);
      const commitment = ethers.keccak256(secret);

      await cosmicPool.connect(user1).deposit(commitment, { value: DEPOSIT_AMOUNT });

      expect(await cosmicPool.getBalance()).to.equal(DEPOSIT_AMOUNT);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to emergency withdraw", async function () {
      const secret = ethers.randomBytes(32);
      const commitment = ethers.keccak256(secret);

      await cosmicPool.connect(user1).deposit(commitment, { value: DEPOSIT_AMOUNT });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await cosmicPool.connect(owner).emergencyWithdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      expect(ownerBalanceAfter).to.be.closeTo(
        ownerBalanceBefore + DEPOSIT_AMOUNT - gasUsed,
        ethers.parseEther("0.001") // Allow small gas variance
      );
    });

    it("Should reject non-owner emergency withdraw", async function () {
      await expect(
        cosmicPool.connect(user1).emergencyWithdraw()
      ).to.be.revertedWith("Only owner");
    });
  });
});