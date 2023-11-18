#!/bin/bash

# Prompt the user for the network name
echo "Please enter the network name:"

# Use the 'read' command to capture user input into a variable
read network

# Check if the user input is empty (i.e., the user pressed Enter without typing anything)
if [ -z "$network" ]; then
  echo "You must enter a valid network name."
  exit 1  # Exit the script with an error code
fi

# Use the user-provided network name in the 'npx hardhat' command
npx hardhat --network "$network" run ./scripts/deploy.gatesender.ts
