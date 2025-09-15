const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-[var(--brown-ligth-50)] text-[14px]"
    >
      <option value="">Seleccionar</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  </div>
);
export default SelectField;
