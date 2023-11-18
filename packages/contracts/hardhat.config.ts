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
      arbygoerli: process.env.ARBYSCAN_API_KEY!,
      zkEVMTestnet: process.env.ETHERSCAN_ZK_EVM!,
      xdai: process.env.GNOSISSCAN_API_KEY!,
      optimisticGoerli: process.env.OPSCAN_API_KEY!,
      baseGoerli: process.env.BASEGOERLI_API_KEY!, 
      polygonZkEVMTestnet: process.env.POLYGONZKEVMSCAN_API_KEY!
    },
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
    }, opgoerli: {
      url: process.env.OPGOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 420,
    }, basegoerli: {
      url: process.env.BASEGOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 84531,
    }
  },
};

export default config;
