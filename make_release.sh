#!/bin/bash
# sh make_release.sh

# Prompt for version number
read -p "Enter the version number for the release: " VERSION

# Create a zip file with the specified version number, including specified files and directories
zip -r "releases/PasteMaster_3000_v${VERSION}.zip" icons/ images/ background.js content.js LICENSE manifest.json popup.html popup.js