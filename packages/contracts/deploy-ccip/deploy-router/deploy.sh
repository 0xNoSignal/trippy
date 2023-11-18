source ./.env

#!/bin/bash

# Check if an argument is provided
if [ "$#" -ne 1 ]; then
    echo "Must specify chain. Ie) Usage: $0 <chain>"
    exit 1
fi

# Assign the first argument to the variable 'chain'
chain=$1

# Conditional branches based on the value of 'chain'
if [ "$chain" == "goerli" ]; then
    forge create --rpc-url $ETHEREUM_GOERLI_RPC_URL \
        --constructor-args "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" \
        --private-key $PRIVATE_KEY \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        --verify \
        contracts/Router.sol:Router

elif [ "$chain" == "gnosis" ]; then
    forge create --rpc-url $GNOSIS_RPC_URL \
        --constructor-args "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d" \
        --private-key $PRIVATE_KEY \
        --etherscan-api-key $GNOSISSCAN_API_KEY \
        --verify \
        contracts/Router.sol:Router

else
    echo "The value of 'chain' is neither 'goerli' nor 'gnosis'."
    # Add commands for any other case here, if needed
fi



