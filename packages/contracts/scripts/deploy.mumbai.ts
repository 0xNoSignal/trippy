import hre, { network, ethers } from "hardhat";
import { mumbai } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);
  if (chainId != 80001) {
    throw new Error("Wrong Network")
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
