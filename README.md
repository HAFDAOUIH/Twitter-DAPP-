# Mini Social (Mini Twitter Clone)

A decentralized social media application built with Ethereum Smart Contracts and ReactJS.

![Mini Social Interface](demo-screenshots/interface.png)

## Overview

Mini Social is a decentralized application (DApp) that provides a Twitter-like social experience on the blockchain. Users can publish posts, interact through likes and dislikes, and edit their content, all while maintaining full ownership of their data through blockchain technology.

## Features

- **Wallet Integration**: Connect seamlessly with MetaMask
- **Account Management**: Switch between different MetaMask accounts
- **Social Interactions**: 
  - Publish posts
  - Like/dislike functionality
  - Post editing (author only)
- **Real-time Feed**: View all posts with engagement metrics
- **Blockchain Security**: All interactions are secured on the Sepolia Testnet

## Interface Screenshots

### Initial Connection Screen
![Connection Screen](demo-screenshots/connection.png)
Users are prompted to connect their MetaMask wallet when first accessing the application.

### Main Interface
![Main Interface](demo-screenshots/main-interface.png)
The main interface shows the connected account address and provides a simple posting interface.

### Transaction Flow
![Transaction Example](demo-screenshots/transaction.png)
Each interaction with the application triggers a MetaMask transaction confirmation.

### News Feed
![News Feed](demo-screenshots/news-feed.png)
Posts appear in the news feed with engagement metrics and timestamps.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [MetaMask Browser Extension](https://metamask.io/)
- Sepolia Testnet ETH (available from Sepolia faucets)
- Web3.js
- React.js

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/mini-social.git
cd mini-social
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure MetaMask**
- Install the MetaMask browser extension
- Connect to Sepolia Test Network
- Acquire test ETH through a Sepolia faucet

4. **Update Contract Configuration**
In `ContractInterface.js`:
```javascript
const contractABI = [...]; // Your contract ABI
const contractAddress = '0xYourContractAddress'; // Your deployed contract address
```

5. **Launch the Application**
```bash
npm start
```
The application will be available at `http://localhost:3000`

## Smart Contract Functions

- `publishPost(string memory _message)`: Create a new post
- `likePost(uint256 postId, bool isLike)`: Like or dislike a post
- `editPost(uint256 postId, string memory newMessage)`: Edit an existing post
- `getPost(uint256 postId)`: Retrieve post details
- `getTotalPosts()`: Get the total number of posts

## Technical Architecture

### Frontend
- React.js for UI components
- Web3.js for blockchain interactions
- MetaMask for wallet connectivity

### Backend
- Ethereum Smart Contracts (Solidity)
- Sepolia Testnet deployment
- Decentralized storage for post data

## File Structure

```
/mini-social
├── /node_modules
├── /public
├── /src
│   ├── ContractInterface.js
│   ├── App.js
│   ├── styles.css
├── package.json
└── README.md
```

## Usage Instructions

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Sepolia Testnet

2. **Create Post**
   - Type your message in the text area
   - Click "Publish Post"
   - Confirm transaction in MetaMask

3. **Interact with Posts**
   - Like/Dislike: Click respective buttons
   - Edit: Available only for posts you authored
   - View: Scroll through the news feed

## Network Requirements

- Network: Sepolia Testnet
- Gas Fee: Small amount of Sepolia ETH required for transactions
- MetaMask: Must be configured for Sepolia network

## Development Tools

- React.js: Frontend framework
- Web3.js: Ethereum blockchain interaction
- Solidity: Smart contract development
- MetaMask: Wallet and transaction management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ethereum Development Community
- React.js Documentation
- Web3.js Documentation
- MetaMask Team
