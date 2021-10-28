#!/usr/bin/env/bash
## =========================================================================
#   Script to setup shell and to define commonly used functions.
#     (thanks to "Michal Czerwinski <holmier@gmail.com>")
## =========================================================================
# shellcheck disable=SC1090 # "Can't follow non-constant source."
# Get ROOT directory from parent script or calculate relative.
DIR_ROOT=${DIR_ROOT:-$(cd "$(dirname "$0")/../" && pwd)}
# stick name of the parent script
PROGNAME=$(basename "$0" ".sh")

# configure runtime reporting & failsafe (see `../cfg.init.sh`)
#DEBUG_MODE="1"
#FAILSAFE_MODE="1"
export COMPOSER_DISABLE_XDEBUG_WARN="1"

##
# Print out info message & error message with timestamp
##
info() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] ($PROGNAME) INFO: $*"
}
err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] ($PROGNAME) ERROR: $*" >&2
}

##
# Trap exit & errors signals
##
finish() {
  # use first parameter of `finish` or exit status of the last executed command as `EXIT_STATUS`
  local EXIT_STATUS="${1:-$?}"
  # print out error message if exit status is not clean (!=0)
  if test "${EXIT_STATUS} -nq 0"; then
    err "exit code: '${EXIT_STATUS}'"
  fi
  # exit from execution with given status
  exit "${EXIT_STATUS}"
}

##
# Define deployment configuration to use (work|live) and check existance of the config file.
##
FILE_CFG="${DIR_ROOT}/cfg/local.sh"
if test -f "${FILE_CFG}"; then
  . "${FILE_CFG}"
else
  err "There is no expected configuration in '${FILE_CFG}'. Aborting..."
  exit 255
fi

##
# Setup shell
##
# Print commands and their arguments as they are executed.
test -n "${DEBUG_MODE}" && set -x
# Exit immediately if a command exits with a non-zero status.
#  the return value of a pipeline is the status of the last command to exit with a non-zero status,
#  or zero if no command exited with a non-zero status
test -n "${FAILSAFE_MODE}" && set -e -o pipefail
test -n "${FAILSAFE_MODE}" && trap finish SIGHUP SIGINT SIGQUIT SIGTERM ERR
