#
#
#  Author       : dmike
#  Date         : 9 December 2017
#  Description  : Generatory script factory for angular2:
#  -module
#  -component
#  -provider
#  -directive
#  -pipe
#
# ============================================================================ #

# ============================================================================ #
# Generate angular pice of code
# Globals:
# loggin function imported in the main script
# Arguments:
#   stuff to generate
# Returns:
#   cat exit code
# ============================================================================ #

source angularbashutil/generators/module_generator.bash
source angularbashutil/generators/component_generator.bash
source angularbashutil/generators/directive_generator.bash
source angularbashutil/generators/provider_generator.bash
source angularbashutil/generators/pipe_generator.bash

function generator__factory() {
  logging__info "Generating code for ${1}"
  local r_code
  local module
  local type=$1
  shift
  case "${type}" in
    "module" )
      generator_module "$@"
      r_code=$?
      ;;
    "component")
      generator_component "$@"
      r_code=$?
      ;;
    "provider")
      generator_provider "$@"
      r_code=$?
      ;;
    "directive")
      generator_directive "$@"
      r_code=$?
      ;;
    "pipe")
      generator_pipe "$@"
      r_code=$?
      ;;
    *)
      r_code=127
      ;;
  esac

  return ${r_code}
}
