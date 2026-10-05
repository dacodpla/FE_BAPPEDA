import { ref } from 'vue'

/**
 * Maps API validation errors ({ error: { fields: { field: msg } } }) to a
 * reactive dictionary FormField can consume via :error="errors.fieldName".
 */
export function useFormErrors() {
  const errors = ref({})
  const generalError = ref(null)

  const setFromApi = (err) => {
    const data = err?.response?.data?.error
    errors.value = data?.fields ? { ...data.fields } : {}
    // Non-field errors (401, 403, 500 etc.) go here so views can display them
    // above the form.
    if (data && !data.fields) {
      generalError.value = { code: data.code, message: data.message }
    } else {
      generalError.value = null
    }
  }

  const clear = (field) => {
    if (field) {
      const next = { ...errors.value }
      delete next[field]
      errors.value = next
    } else {
      errors.value = {}
      generalError.value = null
    }
  }

  const set = (field, message) => {
    errors.value = { ...errors.value, [field]: message }
  }

  return { errors, generalError, setFromApi, clear, set }
}
