// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TrippyToken is ERC20 {
    mapping(address => bool) public isVerified;
    address public owner;

    modifier onlyVerifiedUser() {
        require(isVerified[msg.sender], "User is not verified");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 initialSupply) ERC20("TrippyToken", "TRIPPY") {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    function verify(address user) public onlyOwner {
        isVerified[user] = true;
    }

    function mintByReceiver(
        address receiver,
        uint256 amount
    ) public onlyVerifiedUser {
        _mint(receiver, amount);
    }
}
