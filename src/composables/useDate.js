import dayjs from 'dayjs'
import 'dayjs/locale/id'
import 'dayjs/locale/en'
import { useI18n } from 'vue-i18n'

// API dates are ISO 8601 (YYYY-MM-DD); display format follows the active locale.
export function useDate() {
  const { locale } = useI18n()

  const pattern = () => (locale.value === 'id' ? 'DD/MM/YYYY' : 'MMM D, YYYY')

  const format = (iso) => {
    if (!iso) return '-'
    return dayjs(iso).locale(locale.value).format(pattern())
  }

  const formatRange = (start, end) => {
    if (!start || !end) return '-'
    return start === end ? format(start) : `${format(start)} – ${format(end)}`
  }

  const formatDateTime = (iso) => {
    if (!iso) return '-'
    return dayjs(iso).locale(locale.value).format(`${pattern()} HH:mm`)
  }

  return { format, formatRange, formatDateTime }
}
