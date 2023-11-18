import hre, { network, ethers } from "hardhat";
import { mumbai, arbygoerli } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  let ccip_router;

  if (chainId == 80001) {
    ccip_router = mumbai.ccip_router;
  } else if (chainId == 421613) {
    ccip_router = arbygoerli.ccip_router
  }

  const BasicMessageReceiverargs: any = [mumbai.ccip_router];

  const BasicMessageReceiver = await ethers.deployContract(
    "BasicMessageReceiver",
    BasicMessageReceiverargs
  );

  await BasicMessageReceiver.waitForDeployment();
  console.log(`BasicMessageReceiver deployed at ${await BasicMessageReceiver.getAddress()}`);

  console.log("Verifying MsgReceiver.... ");
  await hre.run("verify:verify", {
    address: await BasicMessageReceiver.getAddress(),
    constructorArguments: BasicMessageReceiverargs,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
