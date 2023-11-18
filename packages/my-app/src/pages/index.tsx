import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";
import * as utils from "../../utils";
import { decodeAbiParameters, parseAbiParameters } from "viem";
const inter = Inter({ subsets: ["latin"] });
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { utils as ethersUtils } from "ethers";

const GATEWAY_ADDRESS = "0xB8452BA3457bD72d7D3277b4832f74f68c78818D"; // OPTIS GOERLI GATEWAY ADDRESS

interface IWorldCoinFeedback {
  merkle_root: string;
  nullifier_hash: string;
  proof: `0x${string}`;
  credential_type: string;
}

export default function Home() {
  const { address, isConnected, isDisconnected } = useAccount();
  const [isWorldcoinVerified, setIsWorldcoinVerified] = useState(false);
  const [verificationData, setVerifcationData] = useState<IWorldCoinFeedback>();
  const toast = useToast();

  const { data: isVerified, isLoading: isLoadingVerified } = useContractRead({
    address: GATEWAY_ADDRESS,
    abi: utils.GATEWAY_ABI,
    functionName: "isUserVerified",
    args: [address],
  });

  const verifyWithSmartContract = async () => {
    console.log("verifyWithSmartContract");
    if (verificationData) {
      const config = await prepareWriteContract({
        address: GATEWAY_ADDRESS,
        abi: utils.GATEWAY_ABI,
        functionName: "verify",
        args: [
          verificationData.merkle_root,
          verificationData.nullifier_hash,
          verificationData &&
            ethersUtils.defaultAbiCoder.decode(
              ["uint256[8]"],
              verificationData.proof
            )[0],
        ],
      });
      const { hash } = await writeContract(config);

      toast({
        title: "Confirm you are a human",
        description: `Checkout: https://goerli-optimism.etherscan.io/tx/${hash}`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      console.log("hash", hash);
    }
  };

  return (
    <>
      <Head>
        <title>Trippy</title>
        <meta name="description" content="Your trip to the other side" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex alignItems={"flex-end"} justifyContent={"flex-end"}>
          <Box>{isConnected && <w3m-button />}</Box>
          <Box>{isConnected && <w3m-network-button />}</Box>
        </Flex>
        <Box border="1px solid black">{isDisconnected && <w3m-button />}</Box>

        <Box>
          <Heading>Are you human?</Heading>
          <IDKitWidget
            app_id="app_staging_289b1a3beb44c91a9bfc39d0a76e8e70" // obtained from the Developer Portal
            action="trippy" // this is your action name from the Developer Portal
            onSuccess={(res: any) => {
              console.log("onSuccess", res);
              setIsWorldcoinVerified(true);
              setVerifcationData(res);
            }} // callback when the modal is closed
            credential_types={["orb"] as CredentialType[]} // optional, defaults to ['orb']
            enableTelemetry={false} // optional, defaults to false
          >
            {({ open }) => <button onClick={open}>Verify with World ID</button>}
          </IDKitWidget>
          {!isVerified && verificationData && (
            <Button variant={"prime"} onClick={verifyWithSmartContract}>
              Verify with Smart Contract
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
