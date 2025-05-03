// src/components/StockStatus.jsx

import React from "react";
import { StockIcon } from "../../../assets/icons/Icon";

const StockStatus = ({ value }) => {
  const type = value < 5 ? "low" : "ok";

  return (
    <span className="flex justify-center items-center gap-1">
      {value}
      <StockIcon type={type} />
    </span>
  );
};

export default StockStatus;
