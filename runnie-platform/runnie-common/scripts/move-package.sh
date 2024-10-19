#!/bin/bash

# Create builds directory
mkdir -p builds

# Get the name of the most recently created .tgz file
PACKAGE_NAME=$(ls -t *.tgz | head -n1)

if [ -z "$PACKAGE_NAME" ]; then
    echo "Error: No .tgz file found"
    exit 1
fi

# Move the package to the builds folder
mv "$PACKAGE_NAME" builds/

echo "Successfully moved $PACKAGE_NAME to builds folder."
