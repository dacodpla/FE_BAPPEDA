// Formats integer Rupiah (never floats). DESIGN.md §12.

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function useCurrency() {
  const format = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '-'
    return formatter.format(Math.round(Number(value)))
  }
  return { format }
}

export function formatIDR(value) {
  return useCurrency().format(value)
}
