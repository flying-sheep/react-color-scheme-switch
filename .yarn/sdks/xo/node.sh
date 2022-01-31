#!/bin/bash
cd "$(dirname -- "$0")/../../.."
NODE_OPTIONS="--no-warnings --require=\"$PWD/.pnp.cjs\" --experimental-loader=\"$PWD/.pnp.loader.mjs\"" exec node "$@"
