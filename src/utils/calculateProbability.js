const DAYS_IN_YEAR = 365

function normalCDF(x) {
  const sign = x < 0 ? -1 : 1
  const z = Math.abs(x) / Math.sqrt(2)
  const t = 1 / (1 + 0.3275911 * z)
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t
    - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z)
  return 0.5 * (1 + sign * erf)
}

export function calculateProbability({ type, spot, strike, iv, dte, rate, dividend }) {
  const S = Number(spot)
  const K = Number(strike)
  const sigma = Number(iv) / 100
  const T = Number(dte) / DAYS_IN_YEAR
  const r = Number(rate) / 100
  const q = Number(dividend) / 100

  const values = [S, K, sigma, T, r, q]
  if (values.some((value) => !Number.isFinite(value)) ||
      S <= 0 || K <= 0 || sigma < 0 || T < 0) return null

  // À expiration ou avec une volatilité nulle.
  if (T === 0 || sigma === 0) {
    const forward = S * Math.exp((r - q) * T)
    const discountedSpot = S * Math.exp(-q * T)
    const discountedStrike = K * Math.exp(-r * T)

    const price = type === 'CALL'
      ? Math.max(discountedSpot - discountedStrike, 0)
      : Math.max(discountedStrike - discountedSpot, 0)

    const otm = type === 'CALL'
      ? (forward < K ? 1 : 0)
      : (forward > K ? 1 : 0)

    return { otm, itm: 1 - otm, price, d2: null }
  }

  const d1 = (
    Math.log(S / K) + (r - q + sigma * sigma / 2) * T
  ) / (sigma * Math.sqrt(T))

  const d2 = d1 - sigma * Math.sqrt(T)

  // Prix théorique Black-Scholes.
  const price = type === 'CALL'
    ? S * Math.exp(-q * T) * normalCDF(d1)
      - K * Math.exp(-r * T) * normalCDF(d2)
    : K * Math.exp(-r * T) * normalCDF(-d2)
      - S * Math.exp(-q * T) * normalCDF(-d1)

  const otm = type === 'CALL'
    ? normalCDF(-d2)
    : normalCDF(d2)

  return {
    otm,
    itm: 1 - otm,
    price: Math.max(price, 0),
    d1,
    d2
  }
}
