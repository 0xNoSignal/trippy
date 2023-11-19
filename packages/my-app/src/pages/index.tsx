import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useNetwork, usePublicClient } from 'wagmi'
import dynamic from "next/dynamic";

import {
  Button as W3MButton,
  Tooltip as W3MTooltip,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
  TextInput,
  GroupBox,
  AppBar,
  Frame
} from 'react95';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  useBoolean, Select,
  useToast,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";
import * as utils from "../../utils";
import { decodeAbiParameters, parseAbiParameters, parseEther } from "viem";
const inter = Inter({ subsets: ["latin"] });
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { utils as ethersUtils } from "ethers";
import { SelectOption } from "react95/dist/Select/Select.types";

const GATEWAY_ADDRESS_OPTIMISM = "0x8306D642BDDaEd4095753d8f126Cddd583e37662"; // OPTIS GOERLI GATEWAY ADDRESS
const GATEWAY_CONTRACT_GOERLI = "0x988dc5CF0B1bd9Ee1D7046C712D32370F5D4e147"; //  GOERLI GATEWAY ADDRESS

const chainSelection = ["polygonZkEVM", "optimism", "base"]
const MAPPING_MSG_SENDER_CONTRACTS = {
  polygonZkEVM: {
    msgsender: "0x7a1120592C328B68D512C06e526b70195Ec9acc2",
    name: "Polygon ZK EVM Testnet",
    chainId: 1442
  },
  gnosis: {
    msgsender: "0x634391a8550e70006a0238b575D880B96909418E",
    name: "Gnosis Testnet",
    chainId: 100
  },
  optimism: {
    msgsender: "0x4584B65aa36E2D45dDe5a48179745E24D50c8469",
    name: "Optimism Goerli",
    chainId: 420
  },
  base: {
    msgsender: "0x4A6066f80ac1A9d55697f154Ed0D1B05711c2C80",
    name: "Base Goerli",
    chainId: 84531
  }
} as any;

interface IWorldCoinFeedback {
  merkle_root: string;
  nullifier_hash: string;
  proof: `0x${string}`;
  credential_type: string;
}

const AsciiCanvas = dynamic(() => import("../../components/ascii-canvas"), {
  ssr: false,
});

export default function Home() {
  const { address, isConnected, isDisconnected } = useAccount();
  const [isWorldcoinVerified, setIsWorldcoinVerified] = useState(false);
  const [verificationData, setVerifcationData] = useState<IWorldCoinFeedback>();
  const toast = useToast();
  const [kyc, setKyc] = useBoolean(true);
  const [depositHash, setDepositHash] = useState<string>();
  const [value, setValue] = useState("");
  const [etherValue, setEtherValue] = useState<bigint>();
  const [selectedOption, setSelectedOption] = useState(chainSelection[0]);
  const { chain, chains } = useNetwork()
  const publicClient = usePublicClient()

  const { data: isVerified, isLoading: isLoadingVerified } = useContractRead({
    address: GATEWAY_ADDRESS_OPTIMISM,
    abi: utils.GATEWAY_ABI,
    functionName: "isVerifiedUser",
    args: [address],
  });

  const handleSelectChange = (event: any) => {
    // Update the state with the new selected option
    setSelectedOption(event.target.value);
    // Log the selected option
    console.log("Selected Option:", event.target.value);
  };

  const handleChange = (event: any) => {
    let inputValue = event.target.value;

    // Replace comma with dot
    inputValue = inputValue.replace(/,/g, '.');
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

  const sendHash = async (
    hash: string,
    dest: string
  ): Promise<
    | {
      message: string;
      success: boolean;
    }
    | undefined
  > => {
    try {
      // Replace 'yourStringValue' with the value you want to send
      const response = await fetch(`/api/axiom?hash=${hash}&dest=${dest}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const depositMoney = async () => {
    console.log("depositMoney");
    if ((isVerified && kyc) || !kyc) {
      setDepositHash("");
      const chainId = MAPPING_MSG_SENDER_CONTRACTS[selectedOption].chainId;
      const msgsender = MAPPING_MSG_SENDER_CONTRACTS[selectedOption].msgsender;
      console.log("etherValue", etherValue)
      const config = await prepareWriteContract({
        address: GATEWAY_CONTRACT_GOERLI,
        abi: utils.GATEWAY_ABI,
        functionName: "depositJustForTestingETH",
        args: [chainId],
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
        title: "Waiting for transaction to be mined",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
      const transaction = await publicClient.waitForTransactionReceipt(
        {
          hash: hash
        }
      )
      toast({
        title: "Transaction mined",
        description: `Transaction mined in block ${transaction.blockNumber}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toast({
        title: "Sending proof to axiom",
        status: "info",
        duration: 2000,
        isClosable: true,
      })
      console.log("transaction", transaction)
      const feedback = await sendHash(hash, msgsender);
      if (!feedback) {
        toast({
          title: "Error creating proof",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if (!feedback.success) {
        toast({
          title: "Error creating proof",
          description: feedback.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Proof send to axiom",
        description: feedback.message,
        status: "success",
        duration: 9000,
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
  const onChange2 = (
    selectedOption: any,
    changeOptions: { fromEvent: React.SyntheticEvent | Event }
  ) => console.log(selectedOption, changeOptions.fromEvent);
  return (
    <>
      <Head>
        <title>Trippy</title>
        <meta name="description" content="Your trip to the other side" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AsciiCanvas />

      <Box w={"100vws"} h="100vh" >
        {isConnected && <AppBar>
          <Toolbar style={{ justifyContent: 'flex-end' }}>
            <Heading pos="absolute" left={4}>TRIPPY</Heading>
            <Box><w3m-button /></Box>
            <Box><w3m-network-button /></Box>
          </Toolbar>
        </AppBar>}
        {isDisconnected && <Flex w="100%" h="100%" alignItems={"center"} justifyContent={"center"}>
          <Frame
            variant='outside'
            shadow
            style={{ padding: '0.5rem', lineHeight: '1.5' }}
          > <w3m-button /></Frame>

         </Flex> }
        {isConnected && <>
          <Box pos="absolute" top={"10%"} right={4}>
            <Window >
              <WindowHeader className='window-title'>
                <span>KYC?</span>
              </WindowHeader>
              <WindowContent>
          <Switch defaultChecked={kyc} onChange={setKyc.toggle}  />
              </WindowContent>
            </Window>
          </Box>
          {kyc && <Box pos="absolute" top={"10%"} left={4}>
            <Window >
              <WindowHeader className='window-title'>
                <span>Are you a human?</span>
              </WindowHeader>
              <WindowContent>
                {!isVerified ? <p>
                  Please use World coin too proof that you are a human
                </p> : <p>You are verified with our smart contract</p>}
              </WindowContent>
              {!isVerified && <Toolbar>
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
                  {({ open }) => (
                    <W3MButton onClick={open} variant='menu' size='sm'>
                      Verify
                    </W3MButton>
                  )}
                </IDKitWidget>
                <Button variant={"prime"} onClick={verifyWithSmartContract} disabled={!verificationData || chain?.id !== 420}>
                  Verify with Smart Contract
                </Button>
              </Toolbar>}
            </Window>
          </Box>}
          <Box pos="absolute" top={"20%"} left={"25%"}>
            <Window resizable className='window'>
              <WindowHeader className='window-title'>
                <span>Send ETH to another chain</span>
              </WindowHeader>


              <WindowContent>
                <p>ETH</p>
                <TextInput
                  placeholder='Type here...'
                  value={value}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                />

                <GroupBox label='default'>

                  <Select value={selectedOption}
                    onChange={handleSelectChange} placeholder='Select destination'>
                    {chainSelection.map((chain) => (<option key={chain} value={chain}>{MAPPING_MSG_SENDER_CONTRACTS[chain].name}</option>))}
                  </Select>


                </GroupBox>
                {chain?.id == 5 ? <Tooltip label="Need to be on goerli">
                  <W3MButton onClick={depositMoney} disabled={!chain || !chain?.id || chain?.id !== 5} >
                    Send to other Chain
                  </W3MButton>
                </Tooltip> : <W3MButton onClick={depositMoney} disabled={!chain || !chain?.id || chain?.id !== 5} >
                  Send to other Chain
                </W3MButton>}
              </WindowContent>

            </Window>
          </Box>
        </>}
      </Box>
    </>
  );
}
