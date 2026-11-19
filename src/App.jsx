import { useMemo, useState } from 'react'
import Field from './components/Field.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import { calculateProbability } from './utils/calculateProbability.js'

const initialValues = {
  type: 'PUT',
  spot: '100',
  strike: '95',
  iv: '25',
  dte: '30',
  rate: '4',
  dividend: '1',
}

export default function App() {
  const [values, setValues] = useState(initialValues)
  const update = (event) => setValues((current) => ({
    ...current,
    [event.target.name]: event.target.value,
  }))

  const result = useMemo(() => calculateProbability(values), [values])

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <header className="mb-4">
            <div className="eyebrow">OPTIONS · BLACK-SCHOLES</div>
            <h1 className="display-6 fw-semibold mt-2">Calculateur de probabilité d'option</h1>
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

              <ResultPanel result={result} />

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setValues(initialValues)}
                >
                  Réinitialiser
                </button>
                <span className="small text-secondary charly010">
                  <a href="https://github.com/charly010" target="_blank">charly010</a>
                </span>
              </div>
            </div>
          </section>

          <p className="disclaimer mt-3 small text-secondary">
            Estimation basée sur une distribution lognormale et le modèle Black-Scholes.
            Elle dépend des données saisies et ne constitue pas une
            prévision ni un conseil en investissement.
          </p>
        </div>
      </div>
    </main>
  )
}
