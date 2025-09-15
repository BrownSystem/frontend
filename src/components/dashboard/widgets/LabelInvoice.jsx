const LabelInvoice = ({ text, optional, other }) => {
  return (
    <label className="flex gap-1 text-[var(--brown-dark-950)] text-[14px] font-medium mb-1">
      {!optional && (
        <span className="text-[15px] text-[var(--brown-dark-700)]">* </span>
      )}
      {text} {other}
    </label>
  );
};

export default LabelInvoice;
