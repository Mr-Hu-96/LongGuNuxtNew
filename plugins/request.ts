import { request } from '~/utils/request'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      request,
    },
  }
})