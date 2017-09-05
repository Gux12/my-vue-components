import * as api from '../utils/api'

export let formulasList = async () => {
  let origin = await api.get('/api/v2/daily/dataset/task?dataset_id=4')
  let list = []
  for (let item of origin) {
    list.push({ id: item.id, result: item.data.text, img: item.url })
  }
  return list
}

export async function simString (string) {
  let simstring = await api.post('/simstring', { query: string })
  return simstring
}

export let own = () => api.get('/api/v2/account/own')
