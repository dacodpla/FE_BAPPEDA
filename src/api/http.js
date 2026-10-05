import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1`

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
})

// Attach a router reference so the interceptor can redirect on 401.
let routerRef = null
export function attachRouter(router) {
  routerRef = router
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const code = error?.response?.data?.error?.code
    if (status === 401 || code === 'UNAUTHENTICATED') {
      if (routerRef && routerRef.currentRoute.value.path !== '/login') {
        routerRef.replace({
          path: '/login',
          query: { redirect: routerRef.currentRoute.value.fullPath },
        })
      }
    }
    return Promise.reject(error)
  },
)

export default http
