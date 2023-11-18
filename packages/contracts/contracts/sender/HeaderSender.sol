// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BasicMessageSender} from "./BasicMessageSender.sol";
import {AxiomV2Client} from "./AxiomV2Client.sol";
import {HyperlaneMessageSender} from "./HyperlaneMessageSender.sol";
import {IGateWay} from "./interfaces/IGateWay.sol";
import {Bytes32ToString} from "./helpers/Bytes32ToString.sol";

contract HeaderSender is
    BasicMessageSender,
    AxiomV2Client,
    HyperlaneMessageSender
{
    event CCIPMessageSent();
    IGateWay public gateway;

    constructor(
        address _router,
        address _link,
        address _outbox,
        address _gateway,
        uint64 _callbackSourceChainId
    ) BasicMessageSender(_router, _link) HyperlaneMessageSender(_outbox) {
        gateway = IGateWay(_gateway);
    }
}
