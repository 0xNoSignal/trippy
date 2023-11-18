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
    address RECEIVER_ADDRESS;
    address owner;

    constructor(
        address _router,
        address _link,
        address _axiomV2QueryAddress,
        address _outbox,
        bytes32 _axiomCallbackQuerySchema,
        address _gateway,
        uint64 _callbackSourceChainId,
        address _receiverAddress
    )
        payable
        BasicMessageSender(_router, _link)
        AxiomV2Client(_axiomV2QueryAddress)
        HyperlaneMessageSender(_outbox)
    {
        callbackSourceChainId = _callbackSourceChainId;
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        gateway = IGateWay(_gateway);
        RECEIVER_ADDRESS = _receiverAddress;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
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
            sourceChainId == callbackSourceChainId,
            "Source chain ID mismatch"
        );
        require(axiomResults.length > 2, "Insufficient data");

        bytes memory all = combineAddressAndAmount(
            axiomResults[0],
            axiomResults[1]
        );

        uint32 destinationChain = uint32(uint256(axiomResults[2]));

        if (destinationChain == 11155111) {
            sendMessage(
                11155111,
                RECEIVER_ADDRESS,
                string(abi.encodePacked(all))
            ); // CCIP
        } else {
            sendViaHyperlane(
                destinationChain,
                bytes32(uint256(uint160(RECEIVER_ADDRESS))),
                all
            ); // Hyperlane
        }
    }

    function combineAddressAndAmount(
        bytes32 to,
        bytes32 amount
    ) internal returns (bytes memory) {
        address a = address(uint160(uint256(to)));
        uint256 b = uint256(amount);
        return abi.encodePacked(a, b);
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

    function topup() external payable {
        require(msg.value > 0, "Must send useless coins");
    }

    function withdrawForTesting() external onlyOwner {
        // has to be deleted on mainnet
        payable(owner).transfer(address(this).balance);
    }
}
