import { sleep } from "../constants/sleep";
import hre, { network, ethers } from "hardhat";
import { gnosis, arbygoerli, optestnet, base, zkEVMTestnet, celotestnet } from "../constants/constants";

const main = async function () {
  const chainId = network.config.chainId;
  console.log(chainId);

  let HyperlaneMessageReceiverargs: any = [];

  if (chainId == 100) {
    HyperlaneMessageReceiverargs = [gnosis.HyperlaneInbox]
  } else if (chainId == 421613) {
    HyperlaneMessageReceiverargs = [arbygoerli.HyperlaneMailbox]
  } else if (chainId == 420) {
    HyperlaneMessageReceiverargs = [optestnet.HyperlaneMailbox]
  } else if (chainId == 84531) {
    HyperlaneMessageReceiverargs = [base.HyperlaneMailbox]
  } else if (chainId == 1442) {
    HyperlaneMessageReceiverargs = [zkEVMTestnet.HyperlaneInbox]
  } else if (chainId == 44787) {
    HyperlaneMessageReceiverargs = [celotestnet.HyperlaneMailbox]
  } else {
    HyperlaneMessageReceiverargs = [ethers.ZeroAddress]
  }

  const HyperlaneMessageReceiver = await ethers.deployContract(
    "HyperlaneMessageReceiver",
    HyperlaneMessageReceiverargs
  );

  await HyperlaneMessageReceiver.waitForDeployment();
  console.log(`HyperlaneMessageReceiver deployed at ${await HyperlaneMessageReceiver.getAddress()}`);

  await sleep(12000);
  console.log("Verifying HyperlaneMessageReceiver.... ");
  await hre.run("verify:verify", {
    address: await HyperlaneMessageReceiver.getAddress(),
    constructorArguments: HyperlaneMessageReceiverargs,
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
