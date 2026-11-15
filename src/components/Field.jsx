export default function Field({ label, name, value, onChange, suffix, step = 'any', min, max }) {
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
