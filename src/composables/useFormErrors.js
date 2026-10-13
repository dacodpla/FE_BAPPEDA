import { ref, nextTick } from 'vue'

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

  /**
   * Focuses the first field (in the order of `ids`) that currently has an
   * error. `ids` maps field name -> DOM id, e.g. { destination: 'req-destination' }.
   */
  const focusFirst = async (ids) => {
    await nextTick()
    for (const [field, id] of Object.entries(ids)) {
      if (errors.value[field]) {
        document.getElementById(id)?.focus()
        return field
      }
    }
    return null
  }

  return { errors, generalError, setFromApi, clear, set, focusFirst }
}
