import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/.env",
});

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY!,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      goerli: process.env.ETHERSCAN_API_KEY!,
      arbitrumGoerli: process.env.ARBYSCAN_API_KEY!,
      zkEVMTestnet: process.env.ETHERSCAN_ZK_EVM!,
      xdai: process.env.GNOSISSCAN_API_KEY!,
      optimisticGoerli: process.env.OPSCAN_API_KEY!,
      baseGoerli: process.env.BASEGOERLI_API_KEY!,
      polygonZkEVMTestnet: process.env.POLYGONZKEVMSCAN_API_KEY!,
      celotestnet: process.env.CELOSCAN_API_KEY!,
      calibration: process.env.CALIBRATIONSCAN_API_KEY!,
      mantletestnet: process.env.MANTLETESTNET_API_KEY!,
      scrolltestnet: process.env.SCROLLTESTNET_API_KEY!,
      lineatestnet: process.env.LINEASCAN_API_KEY!,
    },
    customChains: [
      {
        network: "celotestnet",
        chainId: 44787,
        urls: {
          apiURL: process.env.CELOSCAN_API_KEY!,
          browserURL: "https://alfajores.celoscan.io/",
        },
      },
      {
        network: "lineatestnet",
        chainId: 59140,
        urls: {
          apiURL: process.env.LINEATESTNET_RPC_URL!,
          browserURL: "https://goerli.lineascan.build/",
        },
      },
    ],
  },
  networks: {
    goerli: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.ETHEREUM_GOERLI_RPC_URL || "",
      chainId: 5,
    },
    gnosis: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.GNOSISRPCURL || "",
      chainId: 100,
    },
    mumbai: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.POLYGON_MUMBAI_RPC_URL || "",
      chainId: 80001,
    },
    arbygoerli: {
      url: process.env.ARBITRUM_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 421613,
    },
    zkEVMTestnet: {
      url: process.env.ZK_EVM_TESTNET_RPC || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 1442,
    },
    opgoerli: {
      url: process.env.OPGOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 420,
    },
    basegoerli: {
      url: process.env.BASEGOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 84531,
    },
    celotestnet: {
      url: process.env.CELOTESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 44787,
    },
    lineatestnet: {
      url: process.env.LINEATESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 59140,
    },
    calibration: {
      url: process.env.CALIBRATION_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 314159,
    },
    mantletestnet: {
      url: process.env.MANTLETESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 5001,
    },
    scrolltestnet: {
      url: process.env.SCROLLTESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 534351,
    },
    neonevmtestnet: {
      url: process.env.NEONEVM_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 245022940,
    },
  },
};

export default config;
