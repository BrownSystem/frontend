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
  sizeColumn = 18,
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
    <div className="w-full flex justify-center py-2">
      <div className="w-full bg-[#fdfaf6] rounded-3xl shadow-2xl p-4 border border-[#e4d7c5]">
        {/* Filtro y botón añadir */}
        {(enableFilter || showAddButton) && !externalPagination && (
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            {enableFilter && (
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="🔍 Buscar..."
                className="w-full sm:w-1/2 h-[42px] border border-[var(--brown-ligth-200)] px-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]"
              />
            )}
            {showAddButton && onAddRow && (
              <button
                onClick={onAddRow}
                className="flex items-center justify-center gap-2 bg-[var(--brown-dark-700)] text-white px-5 py-2 rounded-xl hover:bg-[var(--brown-dark-800)] transition-all shadow-md"
              >
                + Añadir
              </button>
            )}
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-[var(--brown-ligth-200)] shadow-inner">
          <table className="w-full table-auto border-collapse text-[var(--brown-dark-900)]">
            <thead className="bg-[var(--brown-ligth-100)] text-[var(--brown-dark-950)]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-center font-semibold text-sm"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-10 text-center">
                    <div className="flex justify-center items-center">
                      <div className="w-10 h-10 border-4 border-b-transparent border-[var(--brown-dark-800)] rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-6 text-gray-500 text-center"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                currentData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => !row.isEditing && onRowClick?.(row)}
                    className={`hover:bg-[var(--brown-ligth-50)] transition-colors cursor-pointer ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-[var(--brown-ligth-50)]"
                    }`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key}
                        className={`px-4 py-2 text-center ${
                          colIndex === 0
                            ? "truncate whitespace-nowrap overflow-hidden text-left"
                            : ""
                        }`}
                        style={{ fontSize: `${sizeColumn}px` }}
                      >
                        {row.isEditing && col.editable ? (
                          <input
                            type="text"
                            value={row[col.key] || ""}
                            onChange={(e) =>
                              onEditCell?.(index, col.key, e.target.value)
                            }
                            className="border border-[var(--brown-ligth-200)] px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]"
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
        </div>

        {/* Paginación */}
        {enablePagination && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-3">
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
              className="px-4 py-2 bg-[var(--brown-dark-700)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brown-dark-800)] transition-colors"
            >
              Anterior
            </button>

            <span className="flex items-center gap-2 font-semibold text-[var(--brown-dark-900)]">
              Página
              <input
                type="number"
                min={1}
                max={externalPagination ? totalPages : totalLocalPages}
                value={externalPagination ? currentPage : localPage}
                onChange={(e) => {
                  const page = Math.max(
                    1,
                    Math.min(
                      Number(e.target.value),
                      externalPagination ? totalPages : totalLocalPages
                    )
                  );
                  externalPagination ? onPageChange(page) : setLocalPage(page);
                }}
                className="w-16 text-center border border-[var(--brown-ligth-200)] rounded px-2 py-1 text-green-700 focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]"
              />
              de
              <span className="text-green-700">
                {externalPagination ? totalPages : totalLocalPages}
              </span>
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
              className="px-4 py-2 bg-[var(--brown-dark-700)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brown-dark-800)] transition-colors"
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
