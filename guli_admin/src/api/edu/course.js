import request from '@/utils/request'

const api_name = '/course'

export default {

  saveVo(courseInfo) {
    return request({
      url: `${api_name}/saveVo`,
      method: 'post',
      data: courseInfo
    })
  }
}
