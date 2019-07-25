import config from './config'

export function post (url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }
    })
  })
}

export function get (url, data) {
  return new Promise((resolve, reject) => {
    return wx.request({
      url: config.host + url,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}
