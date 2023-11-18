import hre, { network, ethers } from "hardhat";
import { gnosis, zkEVMTestnet } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  let msgreceiverargs: any = [
    gnosis.shoyubashi,
    gnosis.HyperlaneInbox,
    gnosis.CCIPRouter,
  ];

  if (chainId === 1442) {
    msgreceiverargs = [
      zkEVMTestnet.shoyubashi,
      zkEVMTestnet.HyperlaneInbox,
      zkEVMTestnet.CCIPRouter,
    ];
  }

  const msgreceiver = await ethers.deployContract(
    "MsgReceiver",
    msgreceiverargs
  );

  await msgreceiver.waitForDeployment();

  console.log(`MsgReceiver deployed at ${await msgreceiver.getAddress()}`);

  await sleep(12000);
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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
