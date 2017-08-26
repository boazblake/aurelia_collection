import { customElement, useView, inject } from 'aurelia-framework'
import { DataModel } from 'ebsi-models'
import style from './style.pcss'


@customElement('ebsi-xxxxxx')
@useView('./view.html')
@inject(DataModel)
export class ebsiXXXXX {
  constructor(model) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.model = model
    this.style = style
  }

  canActivate(params, routeConfig, navigationInstruction) {

  }

  activate(params, routeConfig, navigationInstruction) {

  }

  created(owningView, myView) {

  }

  bind(bindingContext,overrideContext) {

  }

  attached() {

  }

  canDeactivate() {

  }

  deactivate() {

  }

  detached() {

  }

  unbind() {

  }
}