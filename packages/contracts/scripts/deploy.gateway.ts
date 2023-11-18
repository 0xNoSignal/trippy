import hre, { network, ethers } from "hardhat";
import { goerli, optestnet } from "../constants/constants";
import { sleep } from "../constants/sleep";
import dotenv from "dotenv";
dotenv.config();

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  let gatewayargs: any = [];

  if (chainId == 11155111) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ];
  } else if (chainId == 5) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ];
  } else if (chainId == 420) {
    gatewayargs = [
      optestnet.world_address,
      optestnet.world_app_id,
      optestnet.world_action_id,
    ];
  } else if (chainId == 100) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ];
  }

  const gateway = await ethers.deployContract("Gateway", gatewayargs);

  await gateway.waitForDeployment();

  const gatewayAddress = await gateway.getAddress();

  console.log(`Gateway deployed at ${gatewayAddress}`);
  console.log(`ARGS: ${gatewayargs}`);

  await sleep(20000);
  try {
    console.log("Verifying Gateway.... ");
    await hre.run("verify:verify", {
      address: await gateway.getAddress(),
      constructorArguments: gatewayargs,
    });
  } catch (e) {
    console.log(e);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
