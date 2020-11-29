import request from '@/utils/request'

const api_name = '/chapter'

export default {
  getChapterAndVideoById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  save(chapter) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: chapter
    })
  }

}
