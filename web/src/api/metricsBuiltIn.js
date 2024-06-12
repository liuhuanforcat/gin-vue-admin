import { post, get, remove } from "@/utils/request"
import { objectToQueryString, removeEmptyProperties } from "@/utils/utils"

//创建
export const createMetricsBuiltIn = (param) => {
    return post('/api/peregrine/builtin-metrics', [removeEmptyProperties(param)])
}

// 下拉类型list
export const typList = (param) => {
    return get('/api/peregrine/builtin-metrics/types', datparama)
}

//分页查询table，
export const getApiList = (param) => {
    const params = objectToQueryString({
        limit: 10 | param.pageSize,
        p: param.page,
    })
    return get(`/api/peregrine/builtin-metrics?${params}`)
}

//删除table
export const deleteRow = (param) => {
    console.log([param.id])
    return remove('/api/peregrine/builtin-metrics',{ids:[param.id]})
}