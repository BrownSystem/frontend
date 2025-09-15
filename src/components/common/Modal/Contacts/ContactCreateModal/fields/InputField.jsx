const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="text-xs font-medium mb-1 flex gap-2 ">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-[var(--brown-ligth-50)] text-[14px] "
    />
  </div>
);
export default InputField;
