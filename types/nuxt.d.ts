export {}

declare module '#app' {
  interface NuxtApp {
    $request: typeof import('~/utils/request').request
  }
}