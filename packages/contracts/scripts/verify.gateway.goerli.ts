import { goerli } from "../constants/constants";
import hre, { network, ethers } from "hardhat";

const CONTRACT = process.env.CONTRACT!;

async function main() {
  const chainId = network.config.chainId;
  console.log(chainId);
  if (!CONTRACT) {
    throw new Error("CONTRACT env variable not set");
  }

  const msgsenderarg = [
    goerli.world_address,
    goerli.world_app_id,
    goerli.world_action_id,
  ];

  console.log("Verifying Gateway.... ");
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
