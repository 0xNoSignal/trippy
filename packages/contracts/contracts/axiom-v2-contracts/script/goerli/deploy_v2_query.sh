#!/bin/bash

cd $(git rev-parse --show-toplevel)
source .env
echo $PRIVATE_KEY

forge script script/goerli/AxiomV2QueryDeploy.s.sol:AxiomV2QueryDeploy --private-key $PRIVATE_KEY --rpc-url $GNOSIS_RPC_URL --force --verify --etherscan-api-key $GNOSISSCAN_API_KEY -vvvv --watch --broadcast

# if goerli slow and fails to verify, https://github.com/foundry-rs/foundry/issues/2435 
#forge script script/goerli/AxiomV2QueryDeploy.s.sol:AxiomV2QueryDeploy --sender $SENDER_ADDRESS --keystore $KEYSTORE_PATH --rpc-url $GOERLI_RPC_URL --verify --etherscan-api-key $ETHERSCAN_API_KEY -vvvv --resume --wtach