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
    function sendString(
        uint32 _destinationDomain,
        bytes32 _recipient,
        bytes calldata messageBody
    ) public {
        uint256 fee = outbox.quoteDispatch(
            _destinationDomain,
            _recipient,
            messageBody
        );
        outbox.dispatch(_destinationDomain, _recipient, messageBody);
        emit SentMessage(_destinationDomain, _recipient, messageBody);
    }
}
