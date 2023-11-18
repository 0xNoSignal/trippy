// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Bytes32ToBytesLib {
    function convert(bytes32 _data) internal pure returns (bytes memory) {
        bytes memory result = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            result[i] = _data[i];
        }
        return result;
    }
}
