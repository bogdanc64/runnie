#!/bin/bash

# Relative paths to the three projects
projects=(
  "../api-service"
  "../../runnie-extension"
  "../../runnie-ui"
)
# Path pattern for tgz files
builds_folder="./builds"
tgz_pattern="$builds_folder/*.tgz"

# Check if there are any .tgz files
if [ ! "$(ls $tgz_pattern 2>/dev/null)" ]; then
    echo "Error: No .tgz files found matching $tgz_pattern"
    exit 1
fi

# Get the last tgz file
last_tgz=$(ls -t $tgz_pattern | head -n1)

# Check if the last_tgz file exists
if [ ! -f "$last_tgz" ]; then
    echo "Error: The file $last_tgz does not exist"
    exit 1
fi

for project in "${projects[@]}"
do
  echo "Processing project: $project"
  
  dependencies_folder="$project/dependencies"
  mkdir -p "$dependencies_folder"
  
  # Get absolute paths
  abs_last_tgz=$(realpath "$last_tgz")
  abs_dependencies_folder=$(realpath "$dependencies_folder")
  
  echo "Copying from: $abs_last_tgz"
  echo "Copying to: $abs_dependencies_folder"
  
  if ! cp "$abs_last_tgz" "$abs_dependencies_folder"; then
    echo "Error: Failed to copy $abs_last_tgz to $abs_dependencies_folder"
    continue
  fi
  
  copied_tgz="$abs_dependencies_folder/$(basename "$last_tgz")"
  echo "Copied file should be at: $copied_tgz"
  
  if [ ! -f "$copied_tgz" ]; then
    echo "Error: The file was not copied successfully to $copied_tgz"
    continue
  fi
  
  if ! cd "$project"; then
    echo "Error: Failed to change directory to $project"
    continue
  fi
  
  echo "Current working directory: $(pwd)"
  
  if ! npm install "$copied_tgz"; then
    echo "Error: npm install failed for $project"
  else
    echo "Successfully installed $copied_tgz in $project"
  fi
  
  cd - > /dev/null
  echo ""
done