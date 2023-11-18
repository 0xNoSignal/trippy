// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract HyperlaneMessageSender {
    IMailbox outbox;
    event SentMessage(
        uint32 destinationDomain,
        bytes32 recipient,
        bytes message
    );

    constructor(address _outbox) {
        outbox = IMailbox(_outbox);
    }

    // is string memory instead of calldata memory fine?
    function sendViaHyperlane(
        uint32 _destinationDomain,
        address _recipient,
        bytes memory messageBody
    ) public {
        bytes32 recipient = bytes32(uint256(uint160(_recipient)));
        uint256 fee = outbox.quoteDispatch(
            _destinationDomain,
            recipient,
            messageBody
        );
        require(
            address(this).balance >= fee,
            "Insufficient contract balance to cover fee"
        );

        outbox.dispatch{value: fee}(_destinationDomain, recipient, messageBody);
        emit SentMessage(_destinationDomain, recipient, messageBody);
    }
}
