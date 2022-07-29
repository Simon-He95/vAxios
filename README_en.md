<p align="center">
<img  src="./assets/icon.jpg" alt="@simon_he/vAxios">
</p>
<p align="center"><a href="https://www.npmjs.com/package/@simon_he/vAxios"><img src="https://img.shields.io/npm/v/@simon_he/vAxios?color=3fb883&amp;label=" alt="NPM version"></a></p>
<p align="center"><a href="https://www.hejian.club/posts/vAxios">Docs</a></p>
<p align="center"> English | <a href="./README.md">简体中文</a></p>

This article is an additional vAxios documentation for [simon-js-tool] (https://www.npmjs.com/package/simon-js-tool).

## More
- Export function [exports-function](https://github.com/SimonHe1995/exportsFunction)
- threejs [@simon_he/s-three](https://github.com/SimonHe1995/sThree)
- Echarts [@simon_he/s-chart](https://github.com/SimonHe1995/sCharts)
- numsWheel [@simon_he/nums-wheel](https://github.com/SimonHe1995/numsWheel)

## vAxios
- Axios-based packaging
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

axios.get('/api/get', { // The get request can be passed across like any other request
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

