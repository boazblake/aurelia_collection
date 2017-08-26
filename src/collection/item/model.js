import { Item } from './component.js'
import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from "utilities"

// // ==== POST ==================================================================
export const post = http => data =>
  http.post('http://localhost:8080/items/add', data)

export const postTask = http => data =>
  new Task((rej, res) => post(http)(data).then(res, rej))

export const toRequest = item =>{
    let Dto =
      { firstName: item.firstName
      , lastName: item.lastName
      , image: item.image
      }
    return Dto
  }

export const addTask = http =>
  compose(map(identity(dto => JSON.parse(dto.response))),postTask(http)
         , toRequest)

// ==== GET ==================================================================
export const getItem = http => id =>
  http.get(`http://localhost:8080/items/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => getItem(http)(id).then(res, rej))

export const getItemTask =
  compose( map(map(identity(dto => JSON.parse(dto.response)))), getTask)
//

  // ==== UPDATE ==================================================================
export const update = http => id => data =>
  http.put(`http://localhost:8080/items/${id}`, data)

export const updateTask = http => id => data =>
  new Task((rej, res) => update(http)(id)(data).then(res, rej))

export const editTask = http => id =>
  compose(map(identity(dto => JSON.parse(dto.response))), updateTask(http)(id))

  // ==== DELETE ==================================================================
export const remove = http => id =>
  http.delete(`http://localhost:8080/items/${id}`, {_id:id})

export const removeTask = http => id =>
  new Task((rej, res) => remove(http)(id).then(res, rej) )

export const deleteTask =
  compose( map(map(identity(dto => JSON.parse(dto.response)))), removeTask)

  // ==== IMGUR ==================================================================
export const upload = http => b64Dto =>
  Promise.resolve(window.btoa(b64Dto))
  // http.post(`http://uploads.im/api?upload=${b64Dto}`)

export const uploadTask = http => b64Dto =>
  new Task(( rej, res) => upload(http)(b64Dto).then(res, rej))

export const imgUploadTask = http =>
  compose(uploadTask(http),window.btoa)