# 🌌 COSMICAPT - Cross-Chain Privacy Bridge

**Break the link between Ethereum and Aptos wallets for true cross-chain privacy.**

Built for **Build on Aptos - IBW Hackathon** | Track: Payments, RWA & Money Infrastructure

---

## 🔗 Live Demo

- **🌐 Frontend:** https://cosmicapt-frontend.vercel.app
- **🔧 Bridge API:** https://cosmicapt-bridge.onrender.com

---

## 📋 Deployed Contracts

- **Ethereum (Sepolia):** [`0x352D7b31490db844DcCf71838866F612Ee7151Be`](https://sepolia.etherscan.io/address/0x352D7b31490db844DcCf71838866F612Ee7151Be)
- **Aptos (Testnet):** `0x0982e470b961dbb4ac28142a0fc7ebcac1430d2941882aefd7b628902ec5e910`

---

## 🎯 The Problem

Traditional cross-chain bridges expose your entire transaction history:
```
❌ Normal Bridge:
   Alice (0xAAA) on Ethereum → Bridge → Alice (0xAAA) on Aptos
   
   Problem: Everyone can track Alice across chains!
```

---

## 💡 Our Solution

COSMICAPT breaks the on-chain link using a commitment-nullifier privacy system:
```
✅ COSMICAPT:
   Someone (???) deposits on Ethereum
         ↓ [Privacy Pool]
   Someone (???) withdraws on Aptos
   
   Result: IMPOSSIBLE to link the two wallets! 🎭
```

---

## 🎬 How It Works

### 1️⃣ **Deposit** (Ethereum)
- Generate a random secret
- Calculate commitment = hash(secret)
- Deposit 0.0001 ETH with commitment
- Save your secret file

### 2️⃣ **Mix** (Automatic)
- Your deposit joins others in the privacy pool
- Multiple deposits = larger anonymity set
- No one knows which deposit belongs to whom

### 3️⃣ **Withdraw** (Aptos)
- Use a DIFFERENT Aptos wallet (for privacy!)
- Upload your secret file
- Prove you know a secret without revealing which deposit
- Receive APT with zero link to your Ethereum wallet

---

## 🏗️ Architecture
```
┌─────────────────┐
│  Ethereum       │
│  Contract       │ ── Deposit Events ──┐
│  (Solidity)     │                     │
└─────────────────┘                     ↓
                                ┌────────────────┐
                                │  Bridge        │
                                │  Backend       │
                                │  (Node.js)     │
                                └────────────────┘
                                        ↓
┌─────────────────┐                    │
│  Aptos          │ ←─── Sync ─────────┘
│  Contract       │
│  (Move)         │
└─────────────────┘
        ↑
        │
        │
┌─────────────────┐
│  Frontend       │
│  (React)        │
│  MetaMask +     │
│  Petra Wallet   │
└─────────────────┘
```

---

## ✨ Features

- ✅ **Cross-Chain Privacy** - Break wallet linkage between Ethereum and Aptos
- ✅ **Commitment-Nullifier System** - Simple hash-based privacy (no complex ZK circuits)
- ✅ **Auto-Syncing Bridge** - Automatic commitment sync from Ethereum to Aptos
- ✅ **Beautiful UI** - Memphis-style design with playful pastels
- ✅ **Dual Wallet Support** - MetaMask (Ethereum) + Petra (Aptos)
- ✅ **Deposit Tracking** - Real-time stats and anonymity set size

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Ethereum Contracts | Solidity 0.8.20 + Hardhat |
| Aptos Contracts | Move + Aptos CLI |
| Bridge Backend | Node.js + Express + ethers.js |
| Frontend | React + Tailwind CSS |
| Deployment | Render (Bridge) + Vercel (Frontend) |

---

## 📁 Project Structure
```
cosmicapt/
├── ethereum/          # Solidity contracts
│   ├── contracts/
│   ├── scripts/
│   └── test/
├── aptos/            # Move contracts
│   └── sources/
├── bridge/           # Node.js backend
│   └── src/
└── frontend/         # React app
    └── src/
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Petra wallet
- Sepolia testnet ETH
- Aptos testnet APT

### Run Locally
```bash
# 1. Start Bridge
cd bridge
npm install
npm start

# 2. Start Frontend
cd frontend
npm install
npm start

# 3. Open http://localhost:3000
```

---

## 🎮 Try It Live

### Step-by-Step Guide:

1. **Visit:** https://cosmicapt-frontend.vercel.app
2. **Deposit Tab:**
   - Connect MetaMask (Sepolia network)
   - Click "Generate Secret"
   - Download the secret file (IMPORTANT!)
   - Click "Deposit Now" and confirm
3. **Wait ~30 seconds** for bridge to sync
4. **Withdraw Tab:**
   - Connect Petra wallet (use a DIFFERENT address!)
   - Upload your secret file
   - Click "Withdraw APT"
5. **Check Result:**
   - Open Sepolia Etherscan → See your deposit
   - Open Aptos Explorer → See withdrawal to NEW wallet
   - **No way to link them!** 🎭

---

## 🔐 Privacy Mechanism

**Commitment-Nullifier System:**

1. **Secret Generation:** User generates random 32-byte secret
2. **Commitment:** `commitment = keccak256(secret)`
3. **Deposit:** Ethereum contract stores commitment (not secret!)
4. **Mixing:** Multiple users deposit → creates anonymity set
5. **Withdrawal:** User proves they know secret for SOME commitment
6. **Nullifier:** Mark commitment as used to prevent double-spend

**Privacy Guarantee:**
- On-chain observers see deposits and withdrawals
- But can't determine which deposit corresponds to which withdrawal
- Anonymity set = number of unspent deposits in pool

---

## 🧪 Testing
```bash
# Ethereum contracts
cd ethereum
npx hardhat test

# Compile Aptos contracts
cd aptos
aptos move compile

# Test bridge
cd bridge
npm start
curl http://localhost:3001/health
```

---

## 📊 Hackathon Track

**Track 2: Payments, RWA & Money Infrastructure**

We're building privacy infrastructure for cross-chain money movement. This enables:
- Private cross-chain transfers
- Confidential DeFi activity across ecosystems
- Breaking surveillance in cross-chain transactions

---

## 🎯 Future Improvements

- [ ] ZK-SNARK circuits for cryptographic proof of commitment
- [ ] Account Abstraction paymaster for gasless withdrawals
- [ ] Multiple denomination support (0.01, 0.1, 1.0 ETH)
- [ ] Decentralized relayer network
- [ ] Support for more chains (Polygon, Arbitrum, etc.)
- [ ] Token bridge (not just ETH → APT)

---

## 👥 Team

**Harshavardhan M** - Full Stack Blockchain Developer

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Acknowledgments

- Inspired by Tornado Cash and privacy-preserving bridges
- Built during Build on Aptos - IBW Hackathon
- Thanks to Aptos Labs for the infrastructure

---

## 📞 Contact

- GitHub: [@harshavardhan-md](https://github.com/harshavardhan-md)
- Live Demo: https://cosmicapt-frontend.vercel.app

---

**Built with ❤️ for the Aptos ecosystem**