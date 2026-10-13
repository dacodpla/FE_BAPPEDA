import http from './http'

export const dashboardApi = {
  summary: () => http.get('/dashboard/summary').then((r) => r.data),
  upcomingTrips: () => http.get('/dashboard/upcoming-trips').then((r) => r.data),
}
