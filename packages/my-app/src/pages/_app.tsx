import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { MenuList, MenuListItem, Separator, styleReset } from 'react95';
// pick a theme of your choice
import original from 'react95/dist/themes/original';

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { ChakraProvider } from "@chakra-ui/react";

import { WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimismGoerli } from "viem/chains";

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT!;

// 2. Create wagmiConfig
const metadata = {
  name: "Trippy",
  description: "Your trip to the other side",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [goerli, optimismGoerli];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
          <ThemeProvider theme={original}>

      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>
      </ThemeProvider>
    </ChakraProvider>
  );
}
