#!/bin/bash
pdir="$(realpath "$(dirname -- "$0")/../../..")"
export NODE_OPTIONS="--no-warnings --require=\"$pdir/.pnp.cjs\" --experimental-loader=\"$pdir/.pnp.loader.mjs\""
exec node "$@"
