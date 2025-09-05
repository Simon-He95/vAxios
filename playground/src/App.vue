<script setup lang="ts">
import { vAxios } from '../../src'

const axios = vAxios({
  baseURL: 'https://httpbin.org',
  timeout: 1000,
})
axios
  .get(
    '/api',
    {},
    {
      baseURL: 'http://httpbin.org',
    },
  )
  .then((res) => {
    console.log(res)
  })
</script>

<template>
  <div>
    hi
  </div>
</template>

<style scoped></style>
