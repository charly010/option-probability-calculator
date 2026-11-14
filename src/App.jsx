import { useMemo, useState } from 'react'

const initialValues = {
  type: 'PUT',
  spot: '100',
  strike: '95',
  iv: '25',
  dte: '30',
  rate: '4.5',
  dividend: '1',
}

// Approximation de la fonction de répartition de la loi normale standard.
function normalCDF(x) {
  const sign = x < 0 ? -1 : 1
  const z = Math.abs(x) / Math.sqrt(2)
  const t = 1 / (1 + 0.3275911 * z)
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t
    - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z)
  return 0.5 * (1 + sign * erf)
}


function calculateProbability({ type, spot, strike, iv, dte, rate, dividend }) {
  const S = Number(spot)
  const K = Number(strike)
  const sigma = Number(iv) / 100
  const T = Number(dte) / 365
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


function Field({ label, name, value, onChange, suffix, step = 'any', min, max }) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label" htmlFor={name}>{label}</label>
      <div className="input-group">
        <input
          className="form-control"
          id={name}
          name={name}
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
          required
        />
        {suffix && <span className="input-group-text">{suffix}</span>}
      </div>
    </div>
  )
}

export default function App() {
  const [values, setValues] = useState(initialValues)
  const update = (event) => setValues((current) => ({
    ...current,
    [event.target.name]: event.target.value,
  }))

  const result = useMemo(() => calculateProbability(values), [values])
  const percent = result ? (result.otm * 100).toFixed(2) : null

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <header className="mb-4">
            <div className="eyebrow">OPTIONS · BLACK-SCHOLES</div>
            <h1 className="display-6 fw-semibold mt-2">Option probability calculator</h1>
            <p className="text-secondary mb-0">
              Estime la probabilité théorique qu'une option expire hors de la monnaie.
            </p>
          </header>

          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <label className="form-label" htmlFor="type">Type d'option</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={values.type}
                  onChange={update}
                >
                  <option value="PUT">PUT</option>
                  <option value="CALL">CALL</option>
                </select>
              </div>

              <div className="row g-3">
                <Field label="Prix du sous-jacent" name="spot" value={values.spot} onChange={update} min="0.01" />
                <Field label="Strike" name="strike" value={values.strike} onChange={update} min="0.01" />
                <Field label="Volatilité implicite (IV)" name="iv" value={values.iv} onChange={update} suffix="%" min="0" />
                <Field label="Jours avant expiration (DTE)" name="dte" value={values.dte} onChange={update} suffix="jours" min="0" step="1" />
                <Field label="Taux sans risque" name="rate" value={values.rate} onChange={update} suffix="%" />
                <Field label="Rendement du dividende" name="dividend" value={values.dividend} onChange={update} suffix="%" />
              </div>


              <div className="result-panel mt-4 p-4">

                <div className="mb-4">
                  <div className="small text-uppercase text-secondary fw-semibold">
                    Prix indicatif de l'option
                  </div>
                  <div className="result-price my-2">
                    {result ? result.price.toFixed(2) : '—'}
                    <span className="fs-6 text-secondary ms-2">
                      par action
                    </span>
                  </div>
                  <div className="small text-secondary">
                    Estimation théorique Black-Scholes
                  </div>
                </div>

                <hr className="opacity-25" />

                <div>
                  <div className="small text-uppercase text-secondary fw-semibold">
                    Probabilité d'expiration OTM
                  </div>
                  <div className="result-value my-2">
                    {percent === null ? '—' : `${percent} %`}
                  </div>
                  <div className="text-secondary small">
                    {result
                      ? `Probabilité ITM complémentaire : ${(result.itm * 100).toFixed(2)} %`
                      : 'Vérifie les valeurs saisies.'}
                  </div>
                </div>

              </div>


              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setValues(initialValues)}
                >
                  Réinitialiser
                </button>
                <span className="small text-secondary charly010"><a href="https://github.com/charly010" target="_blank">charly010</a></span>
              </div>
            </div>
          </section>

          <p className="disclaimer mt-3 small text-secondary">
            Estimation basée sur une distribution lognormale et le modèle Black-Scholes.
            Elle dépend des hypothèses saisies (notamment l'IV) et ne constitue pas une
            prévision ni un conseil en investissement.
          </p>
        </div>
      </div>
    </main>
  )
}