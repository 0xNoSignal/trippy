import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY!,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      goerli: process.env.ETHERSCAN_API_KEY!,
      arbygoerli: process.env.ARBYSCAN_API_KEY!
    },
  },
  networks: {
    goerli: {
      accounts: [process.env.PRIVATE_KEY || ""],
      url: process.env.ETHEREUM_GOERLI_RPC_URL || "",
      chainId: 5,
    },
    gnosis: {
      url: process.env.GNOSISRPCURL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 100,
    },
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 80001,
    },
    arbygoerli: {
      url: process.env.ARBITRUM_TESTNET_RPC_URL || "", 
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 421613,
    }
  },
};

export default config;
