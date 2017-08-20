import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { Router } from 'aurelia-router'
import { HttpClient } from 'aurelia-http-client'
import { getItemTask, editTask, deleteTask, addTask } from './model'
import { log } from 'utilities'

@customElement('item.edit')
@useView('./view.html')
@inject(HttpClient, EventAggregator, Router)
export class Item {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this.data = {}
    this.state = {
      item: {},
      image: 'https://ak2.picdn.net/shutterstock/videos/816607/thumb/1.jpg'
    }
    this.http = http
    this.emitter = emitter
    this.router = router
  }

  activate(params, routeConfig, navigationInstruction) {
    if(params.id) {
      this.state.id = params.id
      this.load()
    } else {
      this.reset()
      console.log(this)
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
    if (this.selectedFiles) {
      createDto(this.state.item)(this.selectedFiles)
    }

    const onError = e => log('e')(e)
    const onSuccess = data =>
      log('data')(data)

    this.state.id
    ? editTask(this.http)(this.state.id)(this.state.item).fork(onError, onSuccess)
    : addTask(this.http)(this.state.item).fork(onError, onSuccess)
  }

  delete() {
    const onError = e => log('e')(e)
    const onSuccess = data =>{
      log('data')(data)
      this.router.navigateToRoute('home.collection')
    }
    deleteTask(this.http)(this.state.id).fork(onError, onSuccess)
  }

  image() {

  }

  reset() {
    this.data = {}
    this.state = {
      item:
        { firstName: ''
        , lastName: ''
        , image: 'https://ak2.picdn.net/shutterstock/videos/816607/thumb/1.jpg'
        },
    }
  }

}
