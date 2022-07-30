<p align="center">
<img src="./assets/icon.jpg" alt="@simon_he/v-axios">
</p>
<p align="center"><a href="https://www.npmjs.com/package/@simon_he/v-axios"><img src="https://img.shields.io/npm/v/@simon_he/vAxios?color=3fb883&amp;label=" alt="NPM version"></a></p>
<p align="center"><a href="https://www.hejian.club/posts/vAxios">Docs</a></p>
<p align="center"> <a href="./README_en.md">English</a> | 简体中文</p>

本文是 [simon-js-tool] 的附加 vAxios 文档 (https://www.npmjs.com/package/simon-js-tool).

## 更多
- Export function [exports-function](https://github.com/SimonHe1995/exportsFunction)
- threejs [@simon_he/s-three](https://github.com/SimonHe1995/sThree)
- Echarts [@simon_he/s-chart](https://github.com/SimonHe1995/sCharts)
- numsWheel [@simon_he/nums-wheel](https://github.com/SimonHe1995/numsWheel)


## vAxios
- 基于axios的封装
- 重复的请求上一次会被自动取消
- 所有的请求都可以像post请求一样使用post(url, data, config)方式
```js
const axios = vAxios({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  interceptor: {
    request(config) {
      console.log(config)
      return config
    },
    response(response) {
      console.log(response)
      return response
    },
    requestError(error) {
      console.log(error)
      return Promise.reject(error)
    },
    responseError(error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
})

axios.get('/api/get', { // get请求可以像其他请求一样传参
  id: 1,
  name: '22'
}, {
  headers: {
    'Content-Type': 'application/json'
  }
}).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
}).finally(() => {
  console.log('finally')
})

axios.post('/api/get', {
  id: 1,
  name: '22'
}, {
  headers: {
    'Content-Type': 'application/json'
  }
}).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
}).finally(() => {
  console.log('finally')
})
```
