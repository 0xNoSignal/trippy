import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";
import * as utils from "../../utils";
import { decodeAbiParameters, parseAbiParameters, parseEther } from "viem";
const inter = Inter({ subsets: ["latin"] });
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { utils as ethersUtils } from "ethers";

const GATEWAY_ADDRESS_OPTIMISM = "0x8306D642BDDaEd4095753d8f126Cddd583e37662"; // OPTIS GOERLI GATEWAY ADDRESS
const GATEWAY_CONTRACT_GOERLI = "0x988dc5CF0B1bd9Ee1D7046C712D32370F5D4e147"; //  GOERLI GATEWAY ADDRESS

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
  const [kyc, setKyc] = useBoolean();
  const [depositHash, setDepositHash] = useState<string>();
  const [value, setValue] = useState("");
  const [etherValue, setEtherValue] = useState<bigint>();

  const { data: isVerified, isLoading: isLoadingVerified } = useContractRead({
    address: GATEWAY_ADDRESS_OPTIMISM,
    abi: utils.GATEWAY_ABI,
    functionName: "isVerifiedUser",
    args: [address],
  });

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    try {
      const ether = parseEther(inputValue);
      setEtherValue(ether);
    } catch (error) {
      console.error("Error converting to Ether:", error);
      // Handle the error appropriately
      // Maybe show an error message to the user
    }
  };

  const depositMoney = async () => {
    console.log("depositMoney");
    if ((isVerified && kyc) || !kyc) {
      setDepositHash("");
      const config = await prepareWriteContract({
        address: GATEWAY_CONTRACT_GOERLI,
        abi: utils.GATEWAY_ABI,
        functionName: "depositJustForTesting",
        args: [1442],
        value: etherValue,
      });
      const { hash } = await writeContract(config);
      setDepositHash(hash);
      toast({
        title: "Confirm you are a human",
        description: `Checkout: https://goerli.etherscan.io/tx/${hash}`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      toast({
        title: "Creating proof via axiom",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "KYC required",
        description: `You need to verify your identity before you can deposit money`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const verifyWithSmartContract = async () => {
    console.log("verifyWithSmartContract");
    if (verificationData) {
      const config = await prepareWriteContract({
        address: GATEWAY_ADDRESS_OPTIMISM,
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

        <Box border="2px solid black" p={5} m={2}>
          <Heading>Are you human?</Heading>
          <IDKitWidget
            app_id="app_staging_289b1a3beb44c91a9bfc39d0a76e8e70" // obtained from the Developer Portal
            action="trippy"
            signal={address} // this is your action name from the Developer Portal
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
        <Box border="2px solid black" p={5} m={2}>
          <Heading>Deposit money</Heading>
          <Box>
            <Heading size={"sm"}>ETH</Heading>
            <Input
              value={value}
              onChange={handleChange}
              placeholder="Enter a value"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
