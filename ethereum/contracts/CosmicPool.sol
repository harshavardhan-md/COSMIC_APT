// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CosmicPool
 * @notice Cross-chain privacy bridge - Ethereum deposit side
 * @dev Users deposit fixed 0.0001 ETH and submit commitment hash
 */
contract CosmicPool {
    // Fixed deposit amount (0.0001 ETH)
    uint256 public constant DEPOSIT_AMOUNT = 0.0001 ether;
    
    // Track all commitments
    mapping(bytes32 => bool) public commitments;
    
    // Array to enumerate commitments (for off-chain indexing)
    bytes32[] public commitmentList;
    
    // Owner (for emergency withdrawals and admin functions)
    address public owner;
    
    // Events
    event Deposit(
        bytes32 indexed commitment,
        uint256 timestamp,
        uint256 depositIndex
    );
    
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Deposit 0.0001 ETH with commitment hash
     * @param _commitment Hash of the secret (keccak256(secret))
     */
    function deposit(bytes32 _commitment) external payable {
        require(msg.value == DEPOSIT_AMOUNT, "Must send exactly 0.0001 ETH");
        require(_commitment != bytes32(0), "Invalid commitment");
        require(!commitments[_commitment], "Commitment already exists");
        
        // Store commitment
        commitments[_commitment] = true;
        commitmentList.push(_commitment);
        
        emit Deposit(_commitment, block.timestamp, commitmentList.length - 1);
    }
    
    /**
     * @notice Check if commitment exists
     */
    function hasCommitment(bytes32 _commitment) external view returns (bool) {
        return commitments[_commitment];
    }
    
    /**
     * @notice Get total number of deposits
     */
    function getDepositCount() external view returns (uint256) {
        return commitmentList.length;
    }
    
    /**
     * @notice Get commitment by index
     */
    function getCommitment(uint256 index) external view returns (bytes32) {
        require(index < commitmentList.length, "Index out of bounds");
        return commitmentList[index];
    }
    
    /**
     * @notice Emergency withdrawal (owner only)
     * @dev Only for recovering funds in case of critical bugs
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}