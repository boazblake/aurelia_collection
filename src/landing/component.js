import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { HttpClient, json } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { checkAuth } from 'authConfig'
import { userModel, registerTask, loginTask } from './model'
import { map } from 'ramda'

@customElement('landing')
@useView('./view.html')
@inject(HttpClient, EventAggregator, Router)
export class Landing {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this._user = {}
    this.state = {}
    this.http = http
    this.router = router
    this.emitter = emitter
    this.style = 'style'
  }

  login() {
    this.user = userModel(this._user)

    const onError = error =>
      log('ERROR')(error)

    const onSuccess = data => {
      localStorage.setItem('userId', JSON.stringify(data.userId))
      if ( checkAuth() ) this.emitter.publish('auth-channel', true)
      this.router.navigateToRoute('home.collection', {})
    }


    loginTask(this.http)(this.user).fork(onError, onSuccess)
  }

  register() {
    this.user = userModel(this._user)

    const onError = error =>
      log('ERROR')(error)

    const onSuccess = data => {
      localStorage.setItem('userId', JSON.stringify(data.userId))
      log('success')(data)
    }

    log(this.user)

    registerTask(this.http)(this.user).fork(onError, onSuccess)
  }

}
