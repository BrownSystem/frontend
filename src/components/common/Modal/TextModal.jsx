import { StockIcon } from "../../../assets/icons/Icon";

const TextModal = ({ inf, content, contentIcon }) => {
  return (
    <div className="pt-0  flex justify-between gap-4">
      <p className="text-gray-800">{inf}</p>
      <p className="text-gray-400 flex text-[16px] leading-4 items-center ">
        {content}
        {contentIcon && (
          <span>
            {content < 2 ? <StockIcon type="low" /> : <StockIcon type="ok" />}
          </span>
        )}
      </p>
    </div>
  );
};

export default TextModal;
