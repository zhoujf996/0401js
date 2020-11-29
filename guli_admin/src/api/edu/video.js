import request from '@/utils/request'

const api_name = '/video'

export default {
  saveVideo(video) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: video
    })
  }
}
