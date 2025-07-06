import { useEffect, useState } from "react";

export const useLocalTableData = (initialData, itemsPerPage = 6) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = initialData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return {
    data: currentData,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  };
};
