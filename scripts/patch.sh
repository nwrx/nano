#!/bin/bash

# This script is used to patch the distribution of a dependency.
PROJECT=$1
NAME=$2
PATCH_DIR=./node_modules/.pnpm_patches/@$PROJECT/$NAME

rm -rf $PATCH_DIR
pnpm patch @$PROJECT/$NAME --ignore-existing --edit-dir $PATCH_DIR
cp -r ../../$PROJECT/packages/$NAME/dist $PATCH_DIR
pnpm patch-commit $PATCH_DIR
