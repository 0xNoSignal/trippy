// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IWorldID} from "./interfaces/IWorldID.sol";
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Gateway {
    using ByteHasher for bytes;

    mapping(address => Deposit) public deposits;

    event ProfileVerified(address indexed user);
    error InvalidNullifier();
    event Deposited(
        address indexed sender,
        uint256 indexed amount,
        uint256 indexed destinationChainId
    );

    struct Deposit {
        uint256 amount;
        uint256 blockNumber;
        uint256 destinationChainId;
    }

    IWorldID internal worldId;
    uint256 internal immutable externalNullifier;
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => bool) public isVerified;

    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    modifier onlyVerifiedUser() {
        require(isVerified[msg.sender], "User is not verified");
        _;
    }

    function verify(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public payable {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        worldId.verifyProof(
            root,
            1,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifierHash] = true;
        isVerified[msg.sender] = true;

        emit ProfileVerified(msg.sender);
    }

    function isVerifiedUser(address user) public view returns (bool) {
        return isVerified[user];
    }

    function depositCapital(
        uint256 amount,
        IERC20 asset,
        uint256 destinationChainId
    ) public onlyVerifiedUser {
        // deposit capital
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        Deposit memory newDeposit;
        newDeposit.amount = amount;
        newDeposit.blockNumber = block.number;
        newDeposit.destinationChainId = destinationChainId;
        deposits[msg.sender] = newDeposit;

        emit Deposited(msg.sender, amount, destinationChainId);
    }

    function depositCapitalETH(
        uint256 destinationChainId
    ) public payable onlyVerifiedUser {
        require(msg.value > 0, "Incorrect amount");

        Deposit memory newDeposit;
        newDeposit.amount = msg.value;
        newDeposit.blockNumber = block.number;
        newDeposit.destinationChainId = destinationChainId;
        deposits[msg.sender] = newDeposit;

        emit Deposited(msg.sender, msg.value, destinationChainId);
    }

    function getDeposits(
        address _calleraddr
    ) public view returns (Deposit memory deposit) {
        return deposits[_calleraddr];
    }

    function depositJustForTesting(
        uint256 amount,
        IERC20 asset,
        uint256 destinationChainId
    ) public {
        // deposit capital
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        Deposit memory newDeposit;
        newDeposit.amount = amount;
        newDeposit.blockNumber = block.number;
        newDeposit.destinationChainId = destinationChainId;
        deposits[msg.sender] = newDeposit;

        emit Deposited(msg.sender, amount, destinationChainId);
    }

    function depositJustForTestingETH(
        uint256 destinationChainId
    ) public payable {
        require(msg.value > 0, "Incorrect amount");
        // deposit capital
        Deposit memory newDeposit;
        newDeposit.amount = msg.value;
        newDeposit.blockNumber = block.number;
        newDeposit.destinationChainId = destinationChainId;
        deposits[msg.sender] = newDeposit;

        emit Deposited(msg.sender, msg.value, destinationChainId);
    }
}
