import { createI18n } from 'vue-i18n'
import id from './locales/id.json'
import en from './locales/en.json'
import { readSavedLocale } from './composables/useLocale'

const i18n = createI18n({
  legacy: false,
  locale: readSavedLocale() || 'id',
  fallbackLocale: 'en',
  messages: { id, en },
})

document.documentElement.lang = i18n.global.locale.value

export default i18n
