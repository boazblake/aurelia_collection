import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { AureliaConfiguration } from 'aurelia-configuration'
import { Router } from 'aurelia-router'
import { HttpClient } from 'aurelia-http-client'
import { getItemTask, editTask, deleteTask, addTask, imgUploadTask } from './model'
import { log } from 'utilities'
import { map } from 'ramda'
import { BlobToUrlValueConverter } from 'valueConverters'

@customElement('item.edit')
@useView('./view.html')
@inject(HttpClient, EventAggregator, Router, AureliaConfiguration)
export class Item {
  constructor(http, emitter, router, config) {
    this.disposables = new Set()
    this.data = {}
    this.state = {
      item: {
      },
      imgUpload: null
    }
    this.http = http
    this.emitter = emitter
    this.router = router
    this.config = config
  }

  activate(params, routeConfig, navigationInstruction) {
    if(params.id) {
      this.state.id = params.id
      this.load()
    } else {
      this.reset()
    }
  }

  attached() {
  }

  load() {
    const onError = E => log('ERROR')(E)
    const onSuccess = data => {
      this.state.item = data
      this.state.image = this.state.item.image
    }

    getItemTask(this.http)(this.state.id).fork(onError, onSuccess)
  }

  save() {
    if (this.state.selectedFiles) {
      const onError = e => log('e')(e)
      const onSuccess = s => log('s')(s)
      imgUploadTask(this.http)(this.state.selectedFiles[0]).fork(onError, onSuccess)
      this.state.item.image = ''
    }

    const onError = e => log('e')(e)
    const onSuccess = data =>
      log('ITEM SAVED')(data)

    this.state.id
    ? editTask(this.http)(this.state.id)(this.state.item).fork(onError, onSuccess)
    : addTask(this.http)(this.state.item).fork(onError, onSuccess)
  }

  delete() {
    const onError = e => log('e')(e)
    const onSuccess = data =>{
      log('ITEM DELETED')(data)
      this.router.navigateToRoute('home.collection')
    }
    deleteTask(this.http)(this.state.id).fork(onError, onSuccess)
  }

  reset() {
    this.data = {}
    this.state = {
      item:
        { firstName: ''
        , lastName: ''
        , image: 'https://ak2.picdn.net/shutterstock/videos/816607/thumb/1.jpg'
        }
        , imgUpload: null
    }
  }

}
