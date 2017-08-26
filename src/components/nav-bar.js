import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { checkAuth } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(HttpClient, EventAggregator)
export class NavBar {
  @bindable router
  constructor(http, emitter) {
    this.emitter = emitter
    this.authStatus = false
    this.http = http
  }

  bind() {
    const handler = authStatus =>{
      this.authStatus = authStatus
    }

    this.emitter.subscribe('auth-channel', handler )

    checkAuth()
    ? this.emitter.publish('auth-channel', true )
    : this.emitter.publish('auth-channel', false )
  }

  logout(){
    Promise.resolve(this.http.get("http://localhost:8080/auth/logout")).then(() => {
      localStorage.removeItem('userId')
      if( !checkAuth() ) this.emitter.publish('auth-channel', false )
      this.router.navigateToRoute('home')

    })
  }
}
