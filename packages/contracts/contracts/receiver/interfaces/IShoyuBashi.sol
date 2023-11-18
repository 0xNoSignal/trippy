// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IShoyuBashi {
    error AdapterAlreadyEnabled(address emitter, address adapter);
    error AdapterNotEnabled(address emitter, address adapter);
    error DuplicateHashiAddress(address emitter, address hashi);
    error DuplicateOrOutOfOrderAdapters(
        address emitter,
        address adapterOne,
        address adapterTwo
    );
    error DuplicateThreashold(address emitter, uint256 threshold);
    error InvalidAdapter(address emitter, address adapter);
    error NoAdaptersEnabled(address emitter, uint256 domain);
    error NoAdaptersGiven(address emitter);
    error ThresholdNotMet(address emitter);

    event HashiSet(address indexed emitter, address indexed hashi);
    event Init(
        address indexed emitter,
        address indexed owner,
        address indexed hashi
    );
    event Initialized(uint8 version);
    event OracleAdaptersDisabled(
        address indexed emitter,
        uint256 indexed domain,
        address adapters
    );
    event OracleAdaptersEnabled(
        address indexed emitter,
        uint256 indexed domain,
        address adapters
    );
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event ThresholdSet(
        address indexed emitter,
        uint256 domain,
        uint256 threshold
    );

    function adapters(
        uint256,
        address
    ) external view returns (address previous, address next);

    function checkAdapterOrderAndValidity(
        uint256 domain,
        address _adapters
    ) external view;

    function disableOracleAdapters(uint256 domain, address _adapters) external;

    function domains(
        uint256
    ) external view returns (uint256 threshold, uint256 count);

    function enableOracleAdapters(uint256 domain, address _adapters) external;

    function getHash(
        uint256 domain,
        uint256 id,
        address _adapters
    ) external view returns (bytes32 hash);

    function getOracleAdapters(uint256 domain) external view returns (address);

    function getThresholdAndCount(
        uint256 domain
    ) external view returns (uint256 threshold, uint256 count);

    function getThresholdHash(
        uint256 domain,
        uint256 id
    ) external view returns (bytes32 hash);

    function getUnanimousHash(
        uint256 domain,
        uint256 id
    ) external view returns (bytes32 hash);

    function hashi() external view returns (address);

    function init(bytes memory initParams) external;

    function owner() external view returns (address);

    function renounceOwnership() external;

    function setHashi(address _hashi) external;

    function setThreshold(uint256 domain, uint256 threshold) external;

    function transferOwnership(address newOwner) external;
}
