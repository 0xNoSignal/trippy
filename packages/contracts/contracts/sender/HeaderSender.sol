// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {BasicMessageSender} from "./BasicMessageSender.sol";
import {AxiomV2Client} from "./AxiomV2Client.sol";
import {HyperlaneMessageSender} from "./HyperlaneMessageSender.sol";
import {IGateWay} from "./interfaces/IGateWay.sol";
import {Bytes32ToString} from "./helpers/Bytes32ToString.sol";
import {IAxiomV2State} from "../../axiom-v2-contracts/contracts/interfaces/core/IAxiomV2State.sol";
import {Bytes32ToBytesLib} from "./helpers/Bytes32ToBytes.sol";

contract HeaderSender is BasicMessageSender, HyperlaneMessageSender {
    event CCIPMessageSent();
    IGateWay public gateway;
    IAxiomV2State public headerverifier;

    using Bytes32ToBytesLib for bytes32;
    address RECEIVER_ADDRESS;

    constructor(
        address _router,
        address _link,
        address _outbox,
        address _gateway,
        address _headerverifier,
        address _receiver_address
    ) BasicMessageSender(_router, _link) HyperlaneMessageSender(_outbox) {
        gateway = IGateWay(_gateway);
        headerverifier = IAxiomV2State(_headerverifier);
        RECEIVER_ADDRESS = _receiver_address;
    }

    /**
     * prevHash : 28557DED6224E6E220F8B0356D340FB034537685829425674DA6FCE9FDC1CD08
     * root : A37A3EA88EB4C6DC014DCBC39B43AC3560A2C4F7D893D35C634A708D36284D3A
     * numFinal : 384
     * https://goerli.etherscan.io/tx/0x2877b686859d8efcc27c394db5aeb1f4829cfce34b2b58c138828444157e468a#eventlog
     */
    function getpmmr(
        bytes32 prevHash,
        bytes32 root,
        uint32 numFinal,
        bool bridge
    ) public {
        bytes32 pmmr = headerverifier.historicalRoots(10064896);

        // use Hyperlane
        if (bridge == false) {
            sendViaHyperlane(
                1442,
                RECEIVER_ADDRESS,
                Bytes32ToBytesLib.convert(pmmr)
            );
        }
    }
}
