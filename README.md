# Trippy
Trippy is a way to send Ethereum data that is verified in ZK to be included in a set of blockheaders over an arbitrary messaging passing layer to another EVM. We use Axiom for the proof generation and proof data callback and Hyperlane and CCIP for arbitrary message passing to other chains. 

This enables the ability to access proven Ethereum state with a trust assumption on the oracle. 

![image](https://github.com/0xNoSignal/trippy/assets/75167060/036b8f13-4a81-46d5-a7eb-2407deb7a200)

# Deployments 
goerli gateway 0xFB9821782136C1D8D436DfF753011d9946eF4BCd

1. goerli msgsender to polygonzkevm: 0x7a1120592C328B68D512C06e526b70195Ec9acc2
2. goerli msgsender to gnosis: 0x634391a8550e70006a0238b575D880B96909418E
3. goerli msgsender to optestnet: 0x4584B65aa36E2D45dDe5a48179745E24D50c8469
4. goerli msgsender to basegoerli: 0x4A6066f80ac1A9d55697f154Ed0D1B05711c2C80
5. goerli msgsender to arbygoerli: 0xB79A784485c03Be678D305D5Be1f51850AD0349F
6. goerli msgsender to celotestnet: 0xD776847880Bed29bB58D2Ea46d74743F52B6B63E

Receivers: 
1. Polygonzkevm receiver: 0x14713e1c4A714F4b75af6087533d412088C6B352
2. gnosis receiver: 0xf0b8B3B16DB43DE54e0c44BE17b035d72f0f324C
3. optestnet receiver: 0x5c6602be3b6684bbDf2D13caA1f9541d83C35812
4. Basegoerli receiver: 0x8df8fa643482C8a266AaCDa872Cc3080A0638c06
5. mumbai receiver: 0x28B852E5c47331054073b0892338e7e97D59834b
6. Arbitrum goerli receiver: 0x5c6602be3b6684bbDf2D13caA1f9541d83C35812
7. celo goerli receiver: 0x14713e1c4A714F4b75af6087533d412088C6B352

# BlockScanners 

Polygon zkEVM Testnet:
- https://explorer.axiom.xyz/v2/goerli/mock/query/46386219382236011359758875404335934356564264936796304274508124830050244183
- https://explorer.hyperlane.xyz/message/0x24b643a31dc9804b67c9d90994e796aa360c3f5495b2b6cacdc2c3bbaabd42f6

Op Goerli:
- https://explorer.axiom.xyz/v2/goerli/mock/query/29554840718923891974055891284721567494700336873792680544362523788217908881522
- https://explorer.hyperlane.xyz/message/0xa48c1dda9fd7e3edf065fafdf02168502565e79537bcd831720fe0a939bb7253

Base Goerli:
- https://explorer.axiom.xyz/v2/goerli/mock/query/46993079810518358833801851927777730680535707051594678625592920655284980750819
- https://explorer.hyperlane.xyz/message/0x44ca70d9ecbdc96e2b97a40145946e91b6fb94375a996183f188ec14f33c9cf8

![image](https://github.com/0xNoSignal/trippy/assets/75167060/374fb4ed-1933-4a98-bf55-5202ce800d68)
