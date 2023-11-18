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

  console.log(`MsgReceiver deployed at ${msgreceiver.address}`);

  console.log("Verifying MsgReceiver.... ");
  await hre.run("verify:verify", {
    address: msgreceiver.address,
    constructorArguments: msgreceiverargs,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
