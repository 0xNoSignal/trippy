import {IShoyuBashi} from "./interfaces/IShoyuBashi.sol";
import {HyperlaneMessageReceiver} from "./HyperlaneMessageReceiver.sol";
import {BasicMessageReceiver} from "./BasicMessageReceiver.sol";

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract MsgReceiver is HyperlaneMessageReceiver, BasicMessageReceiver {
    IShoyuBashi public bashi;

    constructor(
        address _bashi,
        address _inbox,
        address _router
    ) HyperlaneMessageReceiver(_inbox) BasicMessageReceiver(_router) {
        bashi = IShoyuBashi(_bashi);
    }
}
