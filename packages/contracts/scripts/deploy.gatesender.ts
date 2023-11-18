import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre, { network, ethers } from "hardhat";
import { sepolia, goerli, zkEVMTestnet, optestnet, gnosis, arbygoerli, base, celotestnet } from "../constants/constants";
import { ethers as e } from "ethers";
import { sleep } from "../constants/sleep";
import dotenv from 'dotenv';
import { BasicMessageSender__factory } from "../typechain-types";
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
    ]
  } else if (chainId == 100) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ]
  } else if (chainId == 84531) {
    gatewayargs = [
      goerli.world_address,
      goerli.world_app_id,
      goerli.world_action_id,
    ]
  }

  const gateway = await ethers.deployContract("Gateway", gatewayargs);

  await gateway.waitForDeployment();

  const gatewayAddress = await gateway.getAddress();

  console.log(`Gateway deployed at ${gatewayAddress}`);

  let msgsenderarg: any = [ 
    goerli.ccip_router,
    goerli.link_token,
    goerli.axiomV2QueryAddress,
    goerli.HyperlaneOutbox,
    goerli.axiomCallbackQuerySchema,
    5
  ];

  /**
   *    address _router,
        address _link,
        address _axiomV2QueryAddress,
        address _outbox,
        bytes32 _axiomCallbackQuerySchema,
        address _gateway,
        uint64 _callbackSourceChainId,
        address _receiverAddress
   */
  /**
   * 
        address _router,
        address _link,
        address _axiomV2QueryAddress,
        address _outbox,
        bytes32 _axiomCallbackQuerySchema,
        uint64 _callbackSourceChainId,
        address _receiverAddress
   */

  if (chainId == 11155111) {
    msgsenderarg = [1, 2, 3];
  } else if (process.env.DESTINATION == "polygonzkevmtestnet") {
    msgsenderarg.push(zkEVMTestnet.MsgReceiver)
  } else if (process.env.DESTINATION == "gnosis") {
    msgsenderarg.push(gnosis.MsgReceiver)
  } else if (process.env.DESTINATION == "arbygoerli") {
    msgsenderarg.push(arbygoerli.MsgReceiver)
  } else if (process.env.DESTINATION == "optestnet") {
    msgsenderarg.push(optestnet.MsgReceiver)
  } else if (process.env.DESTINATION == "basegoerli") {
    msgsenderarg.push(base.MsgReceiver)
  } else if (process.env.DESTINATION == "celotestnet") {
    msgsenderarg.push(celotestnet.MsgReceiver)
  }

  console.log(msgsenderarg)

  const msgsender = await ethers.deployContract("MsgSender", msgsenderarg);
  await msgsender.waitForDeployment();

  console.log(`Msgsender deployed at ${await msgsender.getAddress()}`);
  await sleep(12000);
  try {
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
  } catch (e) {
    console.log(e);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
