import http from './http'

// Every call resolves to the response body: { data, meta? }.
export const travelRequestsApi = {
  list: (params) => http.get('/travel-requests', { params }).then((r) => r.data),
  get: (id) => http.get(`/travel-requests/${id}`).then((r) => r.data),
  create: (payload) => http.post('/travel-requests', payload).then((r) => r.data),
  update: (id, payload) => http.patch(`/travel-requests/${id}`, payload).then((r) => r.data),
  policyCheck: (id) => http.post(`/travel-requests/${id}/policy-check`).then((r) => r.data),
  submit: (id) => http.post(`/travel-requests/${id}/submit`).then((r) => r.data),

  uploadDocument: (id, file, onProgress) => {
    const form = new FormData()
    form.append('files', file)
    return http
      .post(`/travel-requests/${id}/documents`, form, {
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      .then((r) => r.data)
  },
  removeDocument: (id, docId) =>
    http.delete(`/travel-requests/${id}/documents/${docId}`).then((r) => r.data),
  documentUrl: (id, docId) =>
    `${http.defaults.baseURL}/travel-requests/${id}/documents/${docId}/file`,
}
