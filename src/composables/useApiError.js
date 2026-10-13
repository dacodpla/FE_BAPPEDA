import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/stores/toast'

const KNOWN_CODES = [
  'BAD_REQUEST',
  'FORBIDDEN',
  'NOT_FOUND',
  'INVALID_TRANSITION',
  'FILE_TOO_LARGE',
  'VALIDATION_ERROR',
  'INTERNAL_ERROR',
]

/**
 * Translates an axios error into a localized message following the
 * DESIGN.md §12 table. 422 field errors are NOT toasted — useFormErrors
 * shows those under each field.
 */
export function useApiError() {
  const { t } = useI18n()
  const toast = useToastStore()

  function messageFor(err) {
    if (!err?.response) return t('errors.network')
    const code = err.response.data?.error?.code
    return KNOWN_CODES.includes(code) ? t(`errors.code.${code}`) : t('errors.generic')
  }

  /** Toast the error unless it is a field-level validation error. */
  function notify(err) {
    const status = err?.response?.status
    if (status === 401) return // the axios interceptor already redirected
    if (status === 422) return
    toast.error(messageFor(err))
  }

  return { messageFor, notify }
}
