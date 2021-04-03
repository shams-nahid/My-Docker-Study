#!/bin/bash
# file: deploy.sh

echo "------------------------------------"
echo "------------------------------------"
echo ">>> Building UI layout"
echo ">>> Going to ui layout"
cd ./lib/ui

echo ">>> Installing node modules for ui layout"
npm install

echo ">>> Building ui layout"
npm run build

echo "Returning the root directory"
cd ../../

echo ">>> Completed Building UI layout"
echo "===================================="
echo "===================================="

# Parse and load the tree map
echo
echo
echo "---------------------------------------------"
echo "---------------------------------------------"
echo ">>> STARTED PARSING AND LOADING THE TREE MAP"

# Go to the parser directory
echo ">>> Going to parser directory"
cd ./lib/parser

# Install node modules for the parser
echo ">>> Installing parser dependencies"
npm install

# Run the parser
echo ">>> Running the parser"
node index.js

# Return the root directory
echo "Returning the root directory"
cd ../../

echo ">>> COMPLETED PARSING AND LOADING THE TREE MAP"
echo "=============================================="
echo "=============================================="

echo ">>> Deploy the app to S3"
aws s3 cp lib/build s3://docker-study.shams-nahid.com/ --recursive