library DecoderLib {
    function decodeAddressAndAmount(
        bytes memory encoded
    ) internal pure returns (address, uint256) {
        require(encoded.length == 52, "Invalid encoded data length");

        bytes20 addressBytes;
        bytes32 amountBytes;

        assembly {
            // Load the first 20 bytes of the encoded data
            addressBytes := mload(add(encoded, 0x20))
            // Load the next 32 bytes of the encoded data
            amountBytes := mload(add(encoded, 0x34))
        }

        return (address(addressBytes), uint256(amountBytes));
    }
}
