import { sleep } from "../constants/sleep";
import { goerli, zkEVMTestnet } from "../constants/constants";
import hre, { network, ethers } from "hardhat";

const CONTRACT = process.env.CONTRACT!;

async function main() {
  const chainId = network.config.chainId;

  if (!CONTRACT) {
    throw new Error("CONTRACT env variable not set");
  }

  const msgsenderarg = [
      goerli.ccip_router,
      goerli.link_token,
      goerli.axiomV2QueryAddress,
      goerli.HyperlaneOutbox,
      goerli.axiomCallbackQuerySchema,
      goerli.gateway_deployment,
      5,
      zkEVMTestnet.MsgReceiver,
    ];

  console.log("Verifying Msgsender.... ");
  await hre.run("verify:verify", {
    address: CONTRACT,
    constructorArguments: msgsenderarg,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// CONTRACT=0x npx hardhat run --network goerli verify.msgsender.goerli.ts
