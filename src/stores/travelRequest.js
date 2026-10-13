import { defineStore } from 'pinia'
import { travelRequestsApi } from '@/api/travelRequests'
import { TRAVEL_REQUEST_STATUS } from '@/constants/statuses'

const emptyForm = () => ({
  destination: '',
  departDate: '',
  returnDate: '',
  purpose: '',
  transport: '',
})

const EDITABLE = [TRAVEL_REQUEST_STATUS.DRAFT, TRAVEL_REQUEST_STATUS.REVISION]

/** Holds the multi-step form so switching steps never loses data. */
export const useTravelRequestStore = defineStore('travelRequest', {
  state: () => ({
    id: null,
    sppdRef: null,
    status: null,
    step: 1,
    form: emptyForm(),
    /** JSON of the last form saved to the API; used to skip no-op PATCHes. */
    savedSnapshot: null,
    documents: [],
    /** In-flight uploads: [{ key, name, progress, error }] */
    uploads: [],
    policy: null,
  }),

  getters: {
    isEditable: (s) => !s.status || EDITABLE.includes(s.status),
    isDirty: (s) => JSON.stringify(s.form) !== s.savedSnapshot,
  },

  actions: {
    reset() {
      this.$reset()
    },

    hydrate(request) {
      this.id = request.id
      this.sppdRef = request.sppdRef
      this.status = request.status
      this.form = {
        destination: request.destination,
        departDate: request.departDate,
        returnDate: request.returnDate,
        purpose: request.purpose,
        transport: request.transport,
      }
      this.savedSnapshot = JSON.stringify(this.form)
      this.documents = request.documents || []
    },

    async load(id) {
      this.reset()
      const { data } = await travelRequestsApi.get(id)
      this.hydrate(data)
    },

    /** Creates the draft on first save, otherwise PATCHes only when changed. */
    async saveTrip() {
      if (!this.id) {
        const { data } = await travelRequestsApi.create({ ...this.form })
        this.hydrate(data)
        return { created: true }
      }
      if (this.isDirty) {
        const { data } = await travelRequestsApi.update(this.id, { ...this.form })
        this.hydrate(data)
        this.policy = null // estimate is stale after trip details change
      }
      return { created: false }
    },

    async runPolicyCheck() {
      const { data } = await travelRequestsApi.policyCheck(this.id)
      this.policy = data
      return data
    },

    async uploadFiles(files) {
      await Promise.all(
        files.map(async (file) => {
          const entry = {
            key: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            progress: 0,
            error: null,
          }
          this.uploads.push(entry)
          const live = this.uploads[this.uploads.length - 1] // reactive proxy
          try {
            const { data } = await travelRequestsApi.uploadDocument(
              this.id,
              file,
              (p) => (live.progress = p),
            )
            this.documents.push(...data)
            this.uploads = this.uploads.filter((u) => u.key !== entry.key)
          } catch (err) {
            const apiError = err?.response?.data?.error
            live.error = { code: apiError?.code || null, message: apiError?.fields?.files || null }
          }
        }),
      )
    },

    dismissUpload(key) {
      this.uploads = this.uploads.filter((u) => u.key !== key)
    },

    async removeDocument(docId) {
      await travelRequestsApi.removeDocument(this.id, docId)
      this.documents = this.documents.filter((d) => d.id !== docId)
    },

    async submit() {
      const { data } = await travelRequestsApi.submit(this.id)
      this.hydrate(data)
      return data
    },
  },
})
