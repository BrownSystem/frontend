import React from "react";

const ActionCardComponent = ({
  onClick,
  svgAction,
  action,
  title,
  others,
  hasNotifications,
}) => {
  return (
    <div className="px-8 w-auto gap-6  shadow-md flex items-center bg-[var(--brown-ligth-100)] rounded-lg ">
      <div>
        <div className="-gradient-to-b from-[var(--brown-ligth-400)] bg-[var(--brown-dark-800)] rounded-lg p-2 w-[40px] cursor-pointer shadow-md">
          {svgAction}
        </div>
        {others && (
          <div className="text-1xl relative pr-5">
            <figure className="flex relative">
              <img
                className="rounded-full h-[35px] w-[35px] z-1"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj00mTDRWomeiIY_ezq_EVu1H_1_9I7IRxA&s"
                alt="logo"
              />
              <img
                className="absolute top-0 right-5 rounded-full h-[35px] w-[35px] z-0"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj00mTDRWomeiIY_ezq_EVu1H_1_9I7IRxA&s"
                alt="logo"
              />
              <div className="absolute top-[-1px] left-5 bg-[var(--brown-ligth-400)] w-[40px] h-[40px] rounded-full z-2 border-2 border-white">
                <p className="text-white text-center font-semibold text-md pt-1">
                  +2
                </p>
              </div>
            </figure>
          </div>
        )}
      </div>
      <div>
        <p className="text-1xl text-gray-500 font-light">{title}</p>
        <div
          onClick={onClick}
          className="!p-0 text-sm !text-green-600  cursor-pointer flex bg-transparent "
        >
          {action}

          <span className="pt-[5.5px] pl-1 relative">
            {hasNotifications && (
              <span className="absolute bottom-[93px] right-[33px]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 2 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z"
                    fill="#f0b520"
                  ></path>
                </svg>
              </span>
            )}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.43704 5.9581L15.5163 2.93168C19.5892 1.57404 21.8095 3.79435 20.4519 7.86729L17.4255 16.9465C15.389 23.0559 12.0585 23.0489 10.0291 16.9465L9.42103 15.1081C9.26546 14.6414 8.74927 14.1252 8.28258 13.9696L6.43703 13.3544C0.334707 11.325 0.334708 7.98749 6.43704 5.9581Z"
                stroke="#00a63e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M9.05322 14.3302L12.8716 10.5118"
                stroke="#00a63e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const ActionCard = React.memo(ActionCardComponent);
export default ActionCard;
