import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre, { network, ethers } from "hardhat";
import { sepolia, goerli } from "../constants/constants";
import { ethers as e } from "ethers";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  let gatewayargs: any = [];

  if (chainId == 11155111) {
    gatewayargs = [1, 2, 3];
  } else if (chainId == 5) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ];
  }

  const gateway = await ethers.deployContract("Gateway", gatewayargs);

  await gateway.waitForDeployment();

  console.log(`Gateway deployed at ${await gateway.getAddress()}`);

  let msgsenderarg: any = [];

  if (chainId == 11155111) {
    msgsenderarg = [1, 2, 3];
  } else if (chainId == 5) {
    msgsenderarg = [
      goerli.ccip_router,
      "0x0000000000000000000000000000000000000000",
      goerli.axiomV2QueryAddress,
      goerli.HyperlaneOutbox,
      goerli.axiomCallbackQuerySchema,
      goerli.gateway_deployment,
      5,
    ];
  }

  const msgsender = await ethers.deployContract("MsgSender", msgsenderarg);
  await msgsender.waitForDeployment();

  console.log(`Msgsender deployed at ${await msgsender.getAddress()}`);

  console.log("Verifying Gateway.... ");
  await hre.run("verify:verify", {
    address: await gateway.getAddress(),
    constructorArguments: gatewayargs,
  });

  console.log("Verifying Msgsender.... ");
  await hre.run("verify:verify", {
    address: await msgsender.getAddress(),
    constructorArguments: msgsenderarg,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
