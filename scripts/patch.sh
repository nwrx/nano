#!/bin/bash

SCRIPT_DIR=$(realpath $(dirname $0))
PROJECT=$1
NAME=$2

# Resolve the absolute paths.
ROOT_DIR=$(realpath $SCRIPT_DIR/..)
PATCH_DIR=$ROOT_DIR/node_modules/.pnpm_patches/@$PROJECT/$NAME
TARGET_DIR=$(realpath $ROOT_DIR/../../$PROJECT/packages/$NAME/dist)

# Remove the existing patch and create a new one.
rm -rf $PATCH_DIR
pnpm patch @$PROJECT/$NAME --ignore-existing --edit-dir $PATCH_DIR
cp -r $TARGET_DIR $PATCH_DIR
pnpm patch-commit $PATCH_DIR
