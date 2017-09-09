import * as api from '../utils/api'

export let formulasList = async () => {
  // let origin = await api.get('/api/v2/daily/dataset/task?dataset_id=4')
  // let list = []
  // for (let item of origin) {
  //   list.push({ id: item.id, result: item.data.text, img: item.url, time: item.time, status: '' })
  // }
  let list = []
  for (let i = 0; i < 100; i++) {
    let sample = {
      id: i.toString(),
      result: i.toString() + '\\times' + i.toString(),
      img: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=c4607874b38f8c54f7decd7d5b404690/0b55b319ebc4b7452898098cc8fc1e178a82151f.jpg',
      time: '1',
      status: ''
    }
    list.push(sample)
  }
  return list
}

export async function simString (string) {
  // let simstring = await api.post('/api/v2/daily/lint/math', { query: string })
  let simstring = { long: [ '123', '124' ], middle: [ '12', '13' ], short: [ '1', '2' ] }
  return simstring
}

export let own = async () => {
  // return await api.get('/api/v2/account/own')
  return { name: '小痘痘' }
}

export let formulasSubmit = async (formulas) => await api.post('/api/v2/daily/dataset/task', formulas)

export let formulasDelete = async (formulas) => await api.post('/api/v2/daily/dataset/delete', formulas)
