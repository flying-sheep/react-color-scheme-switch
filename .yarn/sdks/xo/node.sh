#!/bin/sh
cd "$(dirname -- "$0")/../../.."
exec node --experimental-loader=./.pnp.loader.mjs "$@"
