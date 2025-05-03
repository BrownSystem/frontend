import { StockIcon } from "../../../assets/icons/Icon";

const TextModal = ({ inf, content, contentIcon }) => {
  return (
    <div className="mb-2 flex items-center">
      <span className="font-semibold text-[var(--brown-dark-950)]">
        {" "}
        {inf}:{" "}
      </span>
      <span className="ml-1">{content}</span>
      {contentIcon && (
        <span>
          {content < 5 ? <StockIcon type="low" /> : <StockIcon type="ok" />}
        </span>
      )}
    </div>
  );
};

export default TextModal;
