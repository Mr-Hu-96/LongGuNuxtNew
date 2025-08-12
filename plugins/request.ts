import httpRequest from '~/utils/request'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      httpRequest,
    },
  }
})