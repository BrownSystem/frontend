import { useState, useEffect, useMemo, useRef } from "react";

const GenericTable = ({
  columns,
  data,
  onRowClick,
  onAddRow,
  onEditCell,
  enableFilter = true,
  enablePagination = true,
  showAddButton = false,
  itemsPerPage = 6,
  onVisibleDataChange,
  externalPagination = false,
  currentPage = 1,
  sizeColumn = 20,
  totalPages = 1,
  onPageChange = () => {},
  paginationDisabled = false,
  isLoading = false,
}) => {
  const [searchText, setSearchText] = useState("");
  const [localPage, setLocalPage] = useState(1);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const handleSearch = (e) => {
    setSearchText(normalizeText(e.target.value));
    setLocalPage(1);
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((row) =>
      Object.values(row).some((value) =>
        normalizeText(String(value)).includes(searchText)
      )
    );
  }, [data, searchText]);

  const totalLocalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (localPage - 1) * itemsPerPage;

  const currentData = useMemo(() => {
    if (externalPagination) return data;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, startIndex, itemsPerPage, externalPagination, data]);

  const lastDataRef = useRef([]);

  useEffect(() => {
    const isSameData =
      lastDataRef.current.length === currentData.length &&
      lastDataRef.current.every(
        (prev, i) => prev.code === currentData[i]?.code
      );

    if (!isSameData) {
      lastDataRef.current = currentData;
      if (onVisibleDataChange) {
        onVisibleDataChange(currentData);
      }
    }
  }, [currentData, onVisibleDataChange]);

  return (
    <div className="w-full flex justify-center rounded-lg py-4">
      <div className="w-[90%]">
        {(enableFilter || showAddButton) && !externalPagination && (
          <div className="flex justify-between gap-4 mb-4">
            {enableFilter && (
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Buscar..."
                className="w-full h-[40px] border px-2 rounded"
              />
            )}
            {showAddButton && onAddRow && (
              <button
                onClick={onAddRow}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                +<span>Añadir</span>
              </button>
            )}
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] font-semibold border-b py-2">
              {columns.map((col) => (
                <th key={col.key} className="px-2 items-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center"
                  style={{
                    gridColumn: `span ${columns.length} / span ${columns.length}`,
                  }}
                >
                  <div className="flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-b-transparent border-[var(--brown-dark-800)] rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-gray-500 text-center"
                  style={{
                    gridColumn: `span ${columns.length} / span ${columns.length}`,
                  }}
                >
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => !row.isEditing && onRowClick?.(row)}
                  title={row[columns[1].key]}
                  className={`grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] px-2 py-3 hover:bg-gray-200 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key}
                      className={`px-2 text-center text-[${sizeColumn}] ${
                        colIndex === 0
                          ? "truncate whitespace-nowrap overflow-hidden"
                          : ""
                      }`}
                    >
                      {row.isEditing && col.editable ? (
                        <input
                          type="text"
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            onEditCell?.(index, col.key, e.target.value)
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : col.render ? (
                        col.render(row[col.key], row, index)
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {enablePagination && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                externalPagination
                  ? onPageChange(currentPage - 1)
                  : setLocalPage((p) => Math.max(p - 1, 1))
              }
              disabled={
                paginationDisabled ||
                (externalPagination ? currentPage === 1 : localPage === 1)
              }
              className="px-3 py-1 border rounded disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--brown-dark-800)] text-white cursor-pointer"
            >
              Anterior
            </button>
            <span className="font-semibold flex">
              PÁGINA{" "}
              <p className="text-green-600 mx-2">
                {externalPagination ? currentPage : localPage}
              </p>{" "}
              DE{" "}
              <p className="text-green-600 mx-2">
                {externalPagination ? totalPages : totalLocalPages}
              </p>
            </span>
            <button
              onClick={() =>
                externalPagination
                  ? onPageChange(currentPage + 1)
                  : setLocalPage((p) => Math.min(p + 1, totalLocalPages))
              }
              disabled={
                paginationDisabled ||
                (externalPagination
                  ? currentPage === totalPages
                  : localPage === totalLocalPages)
              }
              className="px-3 py-1 border rounded disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--brown-dark-800)] text-white cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericTable;
