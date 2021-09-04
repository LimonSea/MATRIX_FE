/* eslint-disable */
import { request } from 'umi';
const isDev = process.env.NODE_ENV === 'development';
export const prefix = isDev ? '//192.168.125.122:8080/matrix' : '//39.98.176.144/matrix';
export default function myRequest (url: string, options?: { [key: string]: any }) {
  const headers:any = {};
  if (localStorage.getItem('token')) {
    headers.token = localStorage.getItem('token');
  }
  return request(url, {
    prefix,
    method: 'GET', // 默认是get, 如果需要修改，在 options 中做覆盖
    headers,
    ...(options || {}),
  })
}
