import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
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
  },
};

export default config;
