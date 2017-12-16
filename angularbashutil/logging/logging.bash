# ============================================================================ #
# Generic log function
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  None
# ============================================================================ #
function _log(){
  ## TODO Check active level
   printf "[%s $(date +'%Y-%m-%dT%H:%M:%S%z')]: %s \\n" "$@"
}

# ============================================================================ #
# Log messages of info level.
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  None
# ============================================================================ #
function logging__info() {
  _log 'INFO' "$1"
}

# ============================================================================ #
# Log messages of debug level.
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  None
# ============================================================================ #
function logging__debug() {
  _log 'DEBUG' "$1"
}

# ============================================================================ #
# Log messages error messages on the std_err.
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  None
# ============================================================================ #
function logging__error(){
    _log "ERROR" "$1">&2
}

# ============================================================================ #
# Press enter  to contonue
# Globals:
#  Nonw
# Arguments:
#  None
# Returns:
#  None
# ============================================================================ #
function logging__continue() {
  echo "Press a enter to continue"
  read
}
