import { get } from '@/utils/request'

export const getData = (data) => {
  let url;
  if (data?.time) {
    url = `/api/peregrine/proxy/1/api/v1/query?time=${data?.time}&query=${data?.query}`
  }
  else {
    url = `/api/peregrine/proxy/1/api/v1/query?query=${data?.query}`
  }
  return get(url)
}

export const getDataRange = (data) => {
  return get(`/api/peregrine/proxy/1/api/v1/query_range?query=${data?.query}&start=${data?.start}&end=${data?.end}&step=${data?.step}`)
}

export const getSerchData = () => {
  return get(`/api/n9e/proxy/2/api/v1/label/__name__/values`)
}