// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface Interface {
    struct MmrWitness {
        uint32 snapshotPmmrSize;
        bytes32[] proofMmrPeaks;
        bytes32[] mmrComplementOrPeaks;
    }

    error AxiomCoreAddressIsZero();
    error BlockHashWitnessNotRecent();
    error BlockhashMmrKeccakDoesNotMatchProof();
    error ClaimedMmrDoesNotMatchRecent();
    error ContractIsFrozen();
    error GuardianAddressIsZero();
    error InvalidEmptyHashDepth();
    error MmrEndBlockNotRecent();
    error NoMoreRecentBlockhashPmmr();
    error NotAxiomRole();
    error NotProverRole();
    error PmmrLeafIsNotEmpty();
    error PmmrLeafIsTooBig();
    error ProofMmrKeccakDoesNotMatch();
    error TimelockAddressIsZero();
    error UnfreezeAddressIsZero();

    event AdminChanged(address previousAdmin, address newAdmin);
    event BeaconUpgraded(address indexed beacon);
    event FreezeAll();
    event Initialized(uint8 version);
    event RoleAdminChanged(
        bytes32 indexed role,
        bytes32 indexed previousAdminRole,
        bytes32 indexed newAdminRole
    );
    event RoleGranted(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    event RoleRevoked(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    event UnfreezeAll();
    event UpdateAxiomCoreAddress(address axiomCoreAddress);
    event Upgraded(address indexed implementation);

    function AXIOM_ROLE() external view returns (bytes32);

    function DEFAULT_ADMIN_ROLE() external view returns (bytes32);

    function GUARDIAN_ROLE() external view returns (bytes32);

    function PROVER_ROLE() external view returns (bytes32);

    function TIMELOCK_ROLE() external view returns (bytes32);

    function UNFREEZE_ROLE() external view returns (bytes32);

    function axiomCoreAddress() external view returns (address);

    function freezeAll() external;

    function frozen() external view returns (bool);

    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    function getSourceChainId() external view returns (uint64);

    function grantRole(bytes32 role, address account) external;

    function hasRole(
        bytes32 role,
        address account
    ) external view returns (bool);

    function initialize(
        address _axiomCoreAddress,
        address timelock,
        address guardian,
        address unfreeze
    ) external;

    function proxiableUUID() external view returns (bytes32);

    function renounceRole(bytes32 role, address account) external;

    function revokeRole(bytes32 role, address account) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function unfreezeAll() external;

    function upgradeTo(address newImplementation) external;

    function upgradeToAndCall(
        address newImplementation,
        bytes memory data
    ) external payable;

    function verifyQueryHeaders(
        bytes32 proofMmrKeccak,
        MmrWitness memory mmrWitness
    ) external view;
}
