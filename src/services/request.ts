/* eslint-disable */
import { request } from 'umi';

export default function myRequest (url: string, options?: { [key: string]: any }) {
  return request(url, {
    prefix: '//127.0.0.1:8000/matrix',
    method: 'GET', // 默认是get, 如果需要修改，在 options 中做覆盖
    headers: {
      token: localStorage.getItem('token')
    },
    ...(options || {}),
  })
}
