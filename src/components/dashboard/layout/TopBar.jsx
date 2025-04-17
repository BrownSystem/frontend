import { useEffect, useState } from "react";

const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const date = currentTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between w-full gap-5 pb-3 pt-5 px-5">
      <div className="text-[var(--brown-dark-800)]  text-3xl font-bold w-[80px]">
        GM
      </div>

      <div className="w-full p-2 rounded-md bg-[var(--brown-ligth-50)] border-2 border-white flex justify-center">
        <p className="text-[1rem] tracking-normal text-gray-500 font-medium flex justify-between items-center gap-2">
          {time}
          <span>•</span>
          {date}

          <span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.25 12C21.25 6.89137 17.1086 2.75 12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12Z"
                stroke="#6e4025"
                stroke-width="2"
              ></path>
              <path
                d="M12 7.5V12L15 15"
                stroke="#6e4025"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
};

export default TopBar;
