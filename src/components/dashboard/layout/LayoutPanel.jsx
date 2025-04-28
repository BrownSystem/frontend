import React from "react";

const LayoutPanel = ({ children }) => {
  return (
    <div className="w-full max-h-full flex flex-col px-5 mt-2">{children}</div>
  );
};

export default LayoutPanel;
