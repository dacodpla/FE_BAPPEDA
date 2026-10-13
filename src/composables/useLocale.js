import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'sipedis.locale'
export const SUPPORTED_LOCALES = ['id', 'en']

/** Restores the saved locale at startup; storage may be unavailable. */
export function readSavedLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LOCALES.includes(saved) ? saved : null
  } catch {
    return null
  }
}

export function useLocale() {
  const { locale } = useI18n()

  function setLocale(next) {
    if (!SUPPORTED_LOCALES.includes(next)) return
    locale.value = next
    document.documentElement.lang = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Non-critical per-viewer convenience.
    }
  }

  return { locale, setLocale }
}
