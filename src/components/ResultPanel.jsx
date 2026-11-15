export default function ResultPanel({ result }) {
  const percent = result ? (result.otm * 100).toFixed(2) : null

  return (
    <div className="result-panel mt-4 p-4">
      <div>
        <div className="small text-uppercase text-secondary fw-semibold">
          Probabilité d'expiration OTM
        </div>
        <div className="result-value my-2">
          {percent === null ? '—' : `${percent} %`}
        </div>
        {!result && (
          <div className="text-secondary small">
            Vérifie les valeurs saisies.
          </div>
        )}
      </div>
    </div>
  )
}
