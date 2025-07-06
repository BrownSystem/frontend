import React from "react";

const LayoutPanel = ({ children }) => {
  return (
    <div className="w-full flex flex-col px-1 py-2 ml-[4rem]">{children}</div>
  );
};

export default LayoutPanel;
