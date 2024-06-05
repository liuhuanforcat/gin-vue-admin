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
  console.log('-------======')
  console.log(data)
  let  url=`/api/peregrine/proxy/1/api/v1/query_range?query=${data?.query}&start=${data?.start}&end=${data?.end}&step=${data?.step}`
  // let url = `/api/peregrine/proxy/1/api/v1/query_range?query=${data?.query}&start=1716862384&end=1717467184&step=${data?.step}`
  return get(url)
}