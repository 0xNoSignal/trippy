import hre, { network, ethers } from "hardhat";
import { gnosis } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  const msgreceiverargs: any = [
    gnosis.shoyubashi,
    gnosis.HyperlaneInbox,
    gnosis.CCIPRouter,
  ];

  const msgreceiver = await ethers.deployContract(
    "MsgReceiver",
    msgreceiverargs
  );

  await msgreceiver.waitForDeployment();

  console.log(`MsgReceiver deployed at ${await msgreceiver.getAddress()}`);

  console.log("Verifying MsgReceiver.... ");
  await hre.run("verify:verify", {
    address: await msgreceiver.getAddress(),
    constructorArguments: msgreceiverargs,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
