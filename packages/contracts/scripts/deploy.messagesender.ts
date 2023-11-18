import { sleep } from "../constants/sleep";
import hre, { network, ethers } from "hardhat";
import { goerli } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  const BasicMessageSenderargs: any = [goerli.ccip_router];

  const BasicMessageSender = await ethers.deployContract(
    "BasicMessageSendor",
    BasicMessageSenderargs
  );

  await BasicMessageSender.waitForDeployment();
  console.log(`BasicMessageSendor deployed at ${await BasicMessageSender.getAddress()}`);

  await sleep(12000);
  console.log("Verifying BasicMessageSendor.... ");
  await hre.run("verify:verify", {
    address: await BasicMessageSender.getAddress(),
    constructorArguments: BasicMessageSenderargs,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
