#
#
#  Author       : dmike
#  Date         : 9 December 2017
#  Description  : Module generator script
#
# ============================================================================ #

function generator_module() {
  logging__info "Generating module ${1}"

  if [[ -d "./src" ]]; then
    return 1
  else
    logging__error "Project not initialized"
    return 1
  fi
}
