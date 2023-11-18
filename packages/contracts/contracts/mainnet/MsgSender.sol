// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BasicMessageSender} from "./BasicMessageSender.sol";
import {AxiomV2Client} from "./AxiomV2Client.sol";
import {HyperlaneMessageSender} from "./HyperlaneMessageSender.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IGateWay} from "./interfaces/IGateWay.sol";
import {Bytes32ToString} from "./helpers/Bytes32ToString.sol";

contract MsgSender is
    BasicMessageSender,
    AxiomV2Client,
    HyperlaneMessageSender
{
    using Bytes32ToString for bytes32;

    enum Bridges {
        Hyperlane,
        CCIP
    }

    event CCIPMessageSent();
    uint64 public callbackSourceChainId;
    bytes32 public axiomCallbackQuerySchema;
    IGateWay public gateway;

    constructor(
        address _router,
        address _link,
        address _axiomV2QueryAddress,
        address _outbox,
        bytes32 _axiomCallbackQuerySchema,
        address _gateway,
        uint64 _callbackSourceChainId
    )
        BasicMessageSender(_router, _link)
        AxiomV2Client(_axiomV2QueryAddress)
        HyperlaneMessageSender(_outbox)
    {
        callbackSourceChainId = _callbackSourceChainId;
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        gateway = IGateWay(_gateway);
    }

    function _axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        uint256 queryId,
        bytes32[] calldata axiomResults,
        bytes calldata callbackExtraData
    ) internal override {
        require(
            gateway.getDeposits(callerAddr).amount == 0,
            "No deposits with this address"
        );

        require(
            sourceChainId == callbackSourceChainId,
            "Source chain ID mismatch"
        );

        string memory convertedString = axiomResults[0].bytes32ToString();

        // 11155111 - Sepolia
        sendMessage(11155111, callerAddr, convertedString);
        sendString(
            11155111,
            bytes32(uint256(uint160(callerAddr)) << 96),
            convertedString
        );
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema
    ) internal override {
        require(
            sourceChainId == callbackSourceChainId,
            "AxiomV2: caller sourceChainId mismatch"
        );
        require(
            querySchema == axiomCallbackQuerySchema,
            "AxiomV2: query schema mismatch"
        );
    }
}
