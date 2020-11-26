import request from '@/utils/request'

const api_name = '/subject'

export default{

  getNestedTreeList() {
    return request({
      url: `${api_name}/tree`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }

}
