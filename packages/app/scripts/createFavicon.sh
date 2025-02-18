#!/usr/bin/env bash

# Check if input file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 input.png"
    exit 1
fi

INPUT_IMAGE="$1"

# Ensure input image exists and is a .png
if [ ! -f "$INPUT_IMAGE" ]; then
    echo "File not found: $INPUT_IMAGE"
    exit 1
fi

if [[ "$INPUT_IMAGE" != *.png ]]; then
    echo "Input file must be a .png image"
    exit 1
fi

# This script will use ffmpeg to create the favicon variants for the app.

# Define output variants with sizes
declare -A variants
variants["favicon.ico"]="16:16"
variants["favicon-16x16.png"]="16:16"
variants["favicon-32x32.png"]="32:32"
variants["favicon-48x48.png"]="48:48"
variants["favicon-196x196.png"]="196:196"
variants["apple-touch-icon.png"]="180:180"
variants["android-chrome-192x192.png"]="192:192"
variants["android-chrome-192x192.png"]="192:192"
variants["android-chrome-512x512.png"]="512:512"
variants["mstile-70x70.png"]="70:70"
variants["mstile-150x150.png"]="150:150"
variants["mstile-310x310.png"]="310:310"
variants["linux-chrome-256x256.png"]="256:256"
variants["twitter-card.png"]="512:512"

# Create output directory for generated icons
OUTPUT_DIR="$(dirname "$INPUT_IMAGE")"
mkdir -p "$OUTPUT_DIR"

# Generate icons using ffmpeg
for file in "${!variants[@]}"; do
    size="${variants[$file]}"
    width="${size%%:*}"
    height="${size##*:}"
    ffmpeg -i "$INPUT_IMAGE" -vf "scale=${width}:${height}" "$OUTPUT_DIR/$file" -y
done

echo "Favicon variants generated in $OUTPUT_DIR"
