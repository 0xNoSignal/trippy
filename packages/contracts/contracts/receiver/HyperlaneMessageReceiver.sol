// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "./lib/DecodeLib.sol";

contract HyperlaneMessageReceiver {
    using DecoderLib for bytes;

    IMailbox inbox;
    bytes32 public lastSender;
    string public lastMessage;

    event ReceivedMessage(uint32 origin, bytes32 sender, bytes message);
    event ReceivedDeposit(address from, uint256 amount);

    constructor(address _inbox) {
        inbox = IMailbox(_inbox);
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external {
        // address sender = address(uint160(uint256(_sender)));
        //equire(sender === "OTHERCHAIN_ADDRESS", "Invalid sender");
        (address decodedAddress, uint256 decodedAmount) = _message
            .decodeAddressAndAmount();

        emit ReceivedMessage(_origin, _sender, _message);
        emit ReceivedDeposit(decodedAddress, decodedAmount);
    }
}
