import React from "react";

const ActionCardComponent = ({
  onClick,
  svgAction,
  action,
  title,
  hasNotifications,
}) => {
  return (
    <div className="px-8 w-auto gap-6  shadow-md flex items-center bg-[var(--brown-ligth-100)] rounded-lg ">
      <div>
        <div className="-gradient-to-b from-[var(--brown-ligth-400)] bg-[var(--brown-dark-800)] rounded-lg p-2 w-[40px] cursor-pointer shadow-md">
          {svgAction}
        </div>
      </div>
      <div>
        <p className="text-1xl text-gray-500 font-light text-[14px]">{title}</p>
        <div
          onClick={onClick}
          className="!p-0 text-sm !text-green-600  cursor-pointer flex bg-transparent "
        >
          {action}
        </div>
      </div>
    </div>
  );
};

const ActionCard = React.memo(ActionCardComponent);
export default ActionCard;
