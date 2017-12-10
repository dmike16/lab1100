#
#
#  Author       : dmike
#  Date         : 9 December 2017
#  Description  : Component generator script
#
# ============================================================================ #

function generator_component() {
    logging__info "Generating component ${1}"
    local module
    local component
    local prefix

    component=${1##*/}
    module=${2:-"app"}
    prefix=${3:-${module}}
    ## Check project initialized
    if [[ -d "./src" ]]; then
      if [[ -d "src/${module}" ]]; then
        __generator__create_component "${1}" "src/${module}" "${prefix}" || return $?
        logging__info "Add the component ${component} to the module ${module}"
      else
        logging__error "Module ${module} not found"
        return 1
      fi
    else
      logging__error "Project not initialized"
      return 1
    fi
}

function __generator__create_component() {
  local conteiner
  local module
  local component

  component=${1##*/}
  module=${2##*/}
  container="${2}/${1}"
  ## Not overwrite
  if [[ -d "${container}" ]]; then
    logging__error "Component already crated"
    return 1
  fi
  ## Create folder component
  mkdir -p "${container}" || return $?
  ## Create html template
  touch "${container}/${component}.component.html" || return $?
  ## Create stylesheet
  touch "${container}/${component}.component.scss" || return $?
  ## Create ts controller
  local ts_class
  ts_class=$(perl -pe 's/(^|-)(\w)/\U\2/g' <<< "${component}")
  cat > "${container}/${component}.component.ts"<<CONTROLLER
import { Component } from '@angular/core';

@Component({
  selector: '${prefix}-${component}',
  templateUrl: './${component}.component.html',
  styleUrls: ['./${component}.component.scss']
})
export class ${ts_class}Component {
  constructor(){}
}
CONTROLLER
}
