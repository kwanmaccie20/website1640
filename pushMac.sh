#!/bin/bash

# Get the current date and time
dt=$(date '+%Y%m%d%H%M%S')

# Get the computer name
compName=$(hostname)

# Prompt for commit message
read -p "Commit Message: " commit

# Add all changes to the git index
git add .

# Commit the changes with the current timestamp and computer name
fullstamp="${dt}.local.${compName}"
git commit -m "${fullstamp}- [${commit}]"

# Push changes to remote repository
git push origin master