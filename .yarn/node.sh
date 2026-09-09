#!/bin/bash
pdir="$(realpath "$(dirname -- "$0")/..")"
export NODE_OPTIONS="--no-warnings --require=\"$pdir/.pnp.cjs\" --experimental-loader=\"$pdir/.pnp.loader.mjs\""
if command -v node; then
  exec node "$@"
else
  eval "$(fnm env --use-on-cd --shell bash)"
  exec fnm exec --using="$(fnm default)" node "$@"
fi
