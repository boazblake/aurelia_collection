import { customElement, useView, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { getCollectionTask } from './model'

@customElement('collection')
@useView('./view.html')
@inject(HttpClient)
export class Collection {
  constructor( http ) {
    this.disposables = new Set()
    this._collection = []
    this.state = {}
    this.http = http
    this.style = 'style'
  }

  attached() {
    const onError = error =>
      log('ERROR')(error)

    const onSuccess = data =>{
      this._collection = data
    }

    getCollectionTask(this.http).fork(onError, onSuccess)
  }

}