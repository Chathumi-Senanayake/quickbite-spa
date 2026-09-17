const USD_TO_LKR = 300

export function formatLKR(amountInBaseCurrency: number | string): string {
  const amount = typeof amountInBaseCurrency === 'string'
    ? Number.parseFloat(amountInBaseCurrency)
    : amountInBaseCurrency

  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format((Number.isFinite(amount) ? amount : 0) * USD_TO_LKR)
}
