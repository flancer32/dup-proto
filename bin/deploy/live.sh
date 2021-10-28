#!/usr/bin/env bash
##
#   Rebuild JS project in production mode.
##
# root directory (relative to the current shell script, not to the execution point)
DIR_ROOT=${DIR_ROOT:-$(cd "$(dirname "$0")/../../" && pwd)}
# include commons for standalone running
. "${DIR_ROOT}/bin/commons.sh"

## =========================================================================
#   Setup working environment
## =========================================================================
# check external vars used in this script (see cfg.work.sh)
: "${DIR_STORE:?}"

## =========================================================================
#   Perform processing
## =========================================================================
if test -d "${DIR_ROOT}/node_modules"; then
  err "Project is already installed. Exiting."
  exit 255
fi

info "Copy local configuration to the project:"
SRC="${DIR_ROOT}/../local.sh"
TRG="${DIR_ROOT}/cfg/local.sh"
if test ! -f "${SRC}"; then
  err "Configuration file ${SRC} is missed. Exiting."
  exit 255
fi
info "  '${SRC}' to '${TRG}'"
cp "${SRC}" "${TRG}"

SRC="${DIR_ROOT}/../local.json"
TRG="${DIR_ROOT}/cfg/local.json"
if test ! -f "${SRC}"; then
  err "Configuration file ${SRC} is missed. Exiting."
  exit 255
fi
info "  '${SRC}' to '${TRG}'"
cp "${SRC}" "${TRG}"

info "Link external folders"
cd "${DIR_ROOT}/var/" || exit
ln -s "${DIR_STORE}" store

info "Install NodeJS application."
cd "${DIR_ROOT}" || exit 255
npm install

info "Upgrade DB structure."
cd "${DIR_ROOT}" || exit 255
npm run db-upgrade

info "Done."
