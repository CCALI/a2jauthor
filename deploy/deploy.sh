#!/bin/sh
#
# CAJA Deploy Script
#
# Configuration Options
#
# key (optional)
# Path to identity file used by ssh -i
#
# user
# User for deployment
#
# host
# Server hostname
#
# path
# Deployment path
#
# pre-deploy
# Command to run on the server before the deployment begins
#
# post-deploy
# Command to run on the server after the deployment is done

##
# Config
##
CONFIG=deploy/deploy.conf
EXCLUDED_FILES_CONFIG=deploy/excluded-files.conf
LOG=deploy/deploy.log
BUILD=1
SETUP=1
TEST=1
DEPLOY_ENV=
TAR_NAME=
CLEANUP_TAR=0

##
# Colors
##
# Helpers for prettifying output to user
COLOR_OFF="\033[0m"   # unsets color to term fg color
RED="\033[0;31m"      # red
GREEN="\033[0;32m"    # green
YELLOW="\033[0;33m"   # yellow
CYAN="\033[0;36m"     # cyan

##
# Logging Helpers
##
#
# Regular log
#
function log {
  echo "$@\n" >> $LOG_PATH
  echo "$@\n"
}
#
# Start log
#
function logstart {
  echo "\n${GREEN}$(date +'%b %d %Y %H:%M:%S'): ${COLOR_OFF}Starting CAJA deployment to $DEPLOY_ENV"
  echo "\n$(date +'%b %d %Y %H:%M:%S'): Starting CAJA deployment to $DEPLOY_ENV" >> $LOG_PATH
}
#
# Info
#
function loginfo {
  echo "$@\n" >> $LOG_PATH
  echo "${CYAN}$@ ${COLOR_OFF}"
}
#
# Warning
#
function logwarning {
  echo "$@\n" >> $LOG_PATH
  echo "${YELLOW}$@ ${COLOR_OFF}"
}
#
# Error
#
function logerror {
  echo "ERROR: $@\n" >> $LOG_PATH
  echo "${RED}ERROR: $@ ${COLOR_OFF}"
}
#
# Task progress
#
function progress {
  echo "---> $@\n" >> $LOG_PATH
  echo "${YELLOW}--->${COLOR_OFF} $@"
}
#
# Log an error and exit process
#
function abort {
  if test $CLEANUP_TAR -eq 1; then
    rm $TAR_NAME
  fi
  logerror $@
  exit 1
}

##
# Usage/Help
##
usage() {
  cat <<-EOF

  Usage: deploy [options] <env>

  Options:

    -c, --config <path>  set config path. defaults to deploy/deploy.conf
    -T, --no-tests       do not run tests
    -S, --no-setup       do not perform setup (npm i)
    -B, --no-build       do not perform build
    -h, --help           output help information

EOF
}

##
# Configuration
##
#
# Set configuration file <path>.
#
set_config_path() {
  test -f $1 || abort "Could not open configuration file '$1'"
  CONFIG=$1
}
#
# Check if config <section> exists.
#
config_section() {
  grep "^\[$1" $CONFIG &> /dev/null
}
#
# Get config value by <key>.
#
config_get() {
  local key=$1
  test -n "$key" \
    && grep "^\[$DEPLOY_ENV" -A 20 $CONFIG \
    | grep "^$key" \
    | head -n 1 \
    | cut -d ' ' -f 2-999
}
#
# Output config or [key].
#
config() {
  if test $# -eq 0; then
    cat $CONFIG
  else
    config_get $1
  fi
}
#
# Require environment configuration
#
require_env() {
  config_section $ENV || abort "[$DEPLOY_ENV] config section not defined"
  test -z "$DEPLOY_ENV" && abort "<env> required"
}

##
# Setup
##
#
# Install dependencies
#
run_setup() {
  progress "Installing app dependencies"

  # Install app's dependencies
  npm install >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Unable to install app dependencies, check $LOG_PATH for details

  progress "Installing UI dependencies"

  # Install UI's dependencies
  cd js
  npm install -g grunt-cli >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Unable to install UI dependencies, check $LOG_PATH for details
  npm install >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Unable to install UI dependencies, check $LOG_PATH for details
  cd ..
}

##
# Testing
##
#
# Run the app tests
#
run_tests() {
  progress "Running app Tests"

  # Run app's tests
  npm test >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Running app tests failed, check $LOG_PATH for details

  progress "Running UI Tests"

  # Run UI's tests
  cd js
  npm test >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Running UI tests failed, check $LOG_PATH for details
  cd ..
}

##
# Build
##
#
# Build the app and UI
#
run_build() {
  progress "Building app"

  # Run app's build
  npm run build >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Building app, check $LOG_PATH for details

  progress "Building server app"

  # Run server's build
  npm run build:server >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Building server app, check $LOG_PATH for details

  progress "Building UI app"

  # Run UI's build
  npm run build:client >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Building UI app failed, check $LOG_PATH for details
}

##
# Packaging
##
#
# Move all built file into a tmp directory and create a .zip
#
run_package() {
  progress "Creating deployment package"

  # Clear out tmp directory if it exists
  rm -rf tmp

  # Create a new tmp directory
  mkdir tmp

  # Use rsync to copy all built files to tmp
  rsync -az --exclude-from $EXCLUDED_FILES_CONFIG . tmp >> $LOG_PATH 2>&1
  test $? -eq 0 || abort Could not move app files to /tmp folder, check $LOG_PATH for details

  # Make author/index.html load production version of the site
  rm tmp/js/author/index.html
  mv tmp/js/author/index.production.html tmp/js/author/index.html

  # Make viewer/index.html load production version of the site
  rm tmp/js/viewer/index.html
  mv tmp/js/viewer/index.production.html tmp/js/viewer/index.html

  # Create node_modules/steal folder inside js
  mkdir -p tmp/js/node_modules/steal

  # Copy steal.production.js to js/node_modules/steal
  cp js/node_modules/steal/steal.production.js tmp/js/node_modules/steal/steal.production.js

  # Create zip file of tmp directory
  TAR_NAME=CAJA-$DEPLOY_ENV-$(date +'%b-%d-%Y_%H-%M-%S').tar
  tar -cvf $TAR_NAME tmp/ >> $LOG_PATH 2>&1
}

##
# SSH Helpers
##

#
# Return the ssh command to run.
#
ssh_command() {
  local url="`config_get user`@`config_get host`"
  local key="`config_get key`"
  local port="`config_get port`"
  local needs_tty="`config_get needs_tty`"

  test -n "$key" && local identity="-i $key"
  test -n "$port" && local port="-p $port"
  test -n "$needs_tty" && local tty="-t"
  echo "ssh $tty $port $identity $url"
}
#
# Run the given remote <cmd>.
#
run() {
  local shell="`ssh_command`"
  echo $shell "\"$@\"" >> $LOG_PATH
  $shell $@ >> $LOG_PATH
}
#
# Execute hook <name> relative to the path configured.
#
hook() {
  test -n "$1" || abort hook name required
  local hook=$1
  local path=`config_get path`
  local cmd=`config_get $hook`
  if test -n "$cmd"; then
    progress "Executing $hook \`$cmd\`"
    run "cd $path; \
      $cmd; \
      exit \${PIPESTATUS[0]}"
    test $? -eq 0
  else
    loginfo hook $hook
  fi
}
##
# Send package to server
##
#
# Send zip to server and unpack it in the deploy path
#
run_send() {
  progress "Deploying package to $(config_get host)"

  # Transfer zip to remote host to destination path
  scp $TAR_NAME $(config_get user)@$(config_get host):$(config_get path)
  test $? -eq 0 || abort unable to transfer package to remote host, check $LOG_PATH for details

  progress "Unpacking package in $(config_get path)"

  # Unzip zip on remote host (into tmp/ directory)
  run "tar -xvf $(config_get path)/$TAR_NAME -C $(config_get path)"
  CLEANUP_TAR=1
  test $? -eq 0 || abort unable to unzip package on remote host, check $LOG_PATH for details

  # Copy all files from tmp/ to destination path
  run "cp -R $(config_get path)/tmp/* $(config_get path)"
  test $? -eq 0 || abort unable to move package contents to destination, check $LOG_PATH for details

  # Remove tmp/ and zip file
  run "rm -rf $(config_get path)/tmp"
  run "rm $(config_get path)/$TAR_NAME"
}
##
# Clean up
##
#
# Removes tmp folder and ZIP
#
run_cleanup() {
  progress "Cleaning up source directory"
  rm -rf tmp
  # uncomment to remove TAR file
  # rm $TAR_NAME
}
##
# Deployment
##
run_deploy() {
  logstart

  # Run pre-deployment hook
  hook pre-deploy || abort pre-deploy hook failed, check $LOG_PATH for details

  # Run setup if not disabled by user (-S or --no-setup)
  if test $SETUP -eq 0; then
    logwarning "Skipping setup"
  else
    run_setup
  fi

  # Run build if not disabled by user (-D or --no-build)
  if test $BUILD -eq 0; then
    logwarning "Skipping build"
  else
    run_build
  fi

  # Run tests if not disabled by user (-T or --no-tests)
  if test $TEST -eq 0; then
    logwarning "Skipping tests"
  else
    run_tests
  fi

  # Create package of built assets
  run_package

  # Send package to remote host and unpack it
  run_send

  # Run post-deployment hook
  hook post-deploy || abort post-deploy hook failed, check $LOG_PATH for details

  # Cleanup
  run_cleanup

  # fin
  loginfo "\nCAJA Deployed!\n"
  exit 0
}

##
# Parse command line arguments
##
while test $# -ne 0; do
  arg=$1; shift
  case $arg in
    -h|--help) usage; exit ;;
    -c|--config) set_config_path $1; shift ;;
    -T|--no-tests) TEST=0 ;;
    -S|--no-setup) SETUP=0 ;;
    -B|--no-build) BUILD=0 ;;
    *)
      if test -z "$DEPLOY_ENV"; then
        DEPLOY_ENV=$arg;
      fi
      ;;
  esac
done

require_env

LOG_PATH=$(cd $(dirname "$LOG") && pwd -P)/$(basename "$LOG")

run_deploy
