// import * as api from '../utils/api'
//
// export let formulasList = async () => {
//   let origin = await api.get('/api/v2/daily/dataset/task?dataset_id=4')
//   let list = []
//   for (let item of origin) {
//     list.push({ id: item.id, result: item.data.text, img: item.url, time: item.time, status: '' })
//   }
//   return list
// }
//
// export async function simString (string) {
//   let simstring = await api.post('/api/v2/daily/lint/math', { query: string })
//   return simstring
// }
//
// export let own = async () => {
//   return await api.get('/api/v2/account/own')
// }
//
// export let formulasSubmit = async (formulas) => await api.post('/api/v2/daily/dataset/task', formulas)
//
// export let formulasDelete = async (formulas) => await api.post('/api/v2/daily/dataset/delete', formulas)

import {sampleList, sampleUser} from './mathapi'

export let formulasList = async () => {
  let origin = sampleList.data
  let list = []
  for (let item of origin) {
    list.push({ id: item.id, result: item.data.text, img: item.url, time: item.time, status: '' })
  }
  return list
}

export async function simString (string) {
  let simstring = { long: [ '123', '124' ], middle: [ '12', '13' ], short: [ '1', '2' ] }
  return simstring
}

export let own = async () => {
  return sampleUser
}

export let formulasSubmit = async (formulas) => {}

export let formulasDelete = async (formulas) => {}

