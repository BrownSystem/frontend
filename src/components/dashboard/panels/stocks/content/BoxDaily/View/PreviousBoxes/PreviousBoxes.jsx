import { useMemo, useState, useRef, useEffect } from "react";
import { findAllBoxDaily } from "../../../../../../../../api/boxDaily/boxDaily.api";
import { usePaginatedTableBoxDailyData } from "../../../../../../../../hooks/usePaginatedTableData";
import { FilterPanel, GenericTable } from "../../../../../../widgets";
import { useFindAllBranch } from "../../../../../../../../api/branch/branch.queries";
import { formatFechaISO } from "../../../SupplierContent/tables/InvoiceTable";
import { Danger, Hamburguer } from "../../../../../../../../assets/icons";
import { motion } from "framer-motion";
import { BoxDailyOpenModal } from "../../../../../../../common";
import { useMessageStore } from "../../../../../../../../store/useMessage";
import { useAuthStore } from "../../../../../../../../api/auth/auth.store";
import BoxDetailsModal from "./BoxDetailsModal";

const PreviousBoxes = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateUntil, setDateUntil] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedBox, setSelectedBox] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [showModalReopenBox, setShowModalReopenBox] = useState(false);
  const [showModalDetailBox, setShowModalDetailBox] = useState(false);

  const { setMessage } = useMessageStore();
  const currentUser = useAuthStore((state) => state.user);

  const { data: branches = [] } = useFindAllBranch();

  const menuRef = useRef(null);
  const limit = 20;

  const branchId = branches.find((b) => b.name === branch)?.id;

  const additionalParams = {
    ...(dateFrom && { dateFrom: new Date(dateFrom) }),
    ...(dateUntil && { dateUntil: new Date(dateUntil) }),
    ...(branch && { branch: branchId }),
    status: "CLOSED",
  };

  const {
    data: rawBoxDaily,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableBoxDailyData({
    fetchFunction: findAllBoxDaily,
    queryKeyBase: "box-daily",
    additionalParams,
    limit,
    enabled: true,
  });

  const handleReopenBox = () => {
    setShowModalReopenBox(true);
  };

  const handleDetailBox = () => {
    setShowModalDetailBox(true);
  };

  const handleIconClick = (row, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectedBox(row);
    setMenuPosition({
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY,
    });
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    // ❌ No limpiar selectedBox acá
  };

  // Cierra el menú si clickeás afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columnsBoxDaily = useMemo(
    () => [
      {
        render: (_, row) => (
          <div className="flex gap-2 justify-center items-center">
            <div
              className="cursor-pointer"
              onClick={(e) => handleIconClick(row, e)}
            >
              <motion.div initial="closed" whileHover="open">
                <div className="flex items-center justify-center relative w-7 h-7">
                  <motion.div
                    key="closed"
                    variants={{
                      closed: { opacity: 1, scale: 1 },
                      open: { opacity: 0.5, scale: 1.1 },
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                  >
                    <Hamburguer size={24} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        ),
      },
      {
        key: "number",
        label: "NUMERO",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)] text-center">
            #{value}
          </p>
        ),
      },
      {
        key: "openedAt",
        label: "APERTURA",
        className: "text-center",
        render: (value) => formatFechaISO(value),
      },
      {
        key: "closedAt",
        label: "CIERRE",
        className: "text-center",
        render: (value) => formatFechaISO(value),
      },
      {
        key: "openingAmount",
        label: "SALDO INICIAL",
        className: "text-center",
        render: (value) =>
          `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "closingAmount",
        label: "SALDO FINAL",
        className: "text-center",
        render: (value) =>
          `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "realAmount",
        label: "DIFERENCIA",
        className: "text-center",
        render: (value) => (
          <p className="text-[var(--brown-dark-800)] flex items-center">
            <span
              className={`pl-2 ${
                value < 0
                  ? "text-[var(--text-state-red)]"
                  : "text-[var(--text-state-green)]"
              }`}
            >
              $
              {value?.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
            {value !== 0 && (
              <span className="pl-2 flex items-center">
                <Danger size={22} color={"#a83228"} />
              </span>
            )}
          </p>
        ),
      },
    ],
    [branches]
  );

  return (
    <>
      {/* MODAL DETAILS BOX */}
      {showModalDetailBox && selectedBox && (
        <BoxDetailsModal
          selectedBox={selectedBox}
          setShowModalDetailBox={setShowModalDetailBox}
        />
      )}

      {/* MODAL REOPEN BOX DAILY */}
      {showModalReopenBox && selectedBox && (
        <BoxDailyOpenModal
          setMessage={setMessage}
          origenSucursalSeleccionada={selectedBox.branchId}
          openedBy={currentUser.name}
          branchName={selectedBox.branchName}
          openingAmount={selectedBox.openingAmount}
          boxId={selectedBox.id}
          boxNumber={selectedBox.number}
          type="reopen"
          onClose={() => {
            setShowModalReopenBox(false);
            setSelectedBox(null);
          }}
        />
      )}

      <FilterPanel
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateUntil={dateUntil}
        setDateUntil={setDateUntil}
        setBranch={setBranch}
      />

      <GenericTable
        columns={columnsBoxDaily}
        data={rawBoxDaily}
        enablePagination={true}
        enableFilter={false}
        isLoading={isLoading}
        externalPagination={true}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        paginationDisabled={isLoading}
      />

      {/* MENÚ FLOTANTE */}
      {showMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bg-[var(--brown-ligth-100)] border border-[var(--brown-dark-700)] shadow-lg rounded-md p-2 z-50 w-auto text-xs text-[var(--brown-dark-900)]"
          style={{ top: menuPosition.y, left: menuPosition.x + 8 }}
        >
          <button
            className="block w-full text-left px-3 py-1 hover:bg-[var(--brown-ligth-50)] rounded"
            onClick={() => {
              handleReopenBox();
              handleCloseMenu();
            }}
          >
            REABRIR
          </button>
          <button
            className="block w-full text-left px-3 py-1 hover:bg-[var(--brown-ligth-50)] rounded"
            onClick={() => {
              handleDetailBox();
              handleCloseMenu();
            }}
          >
            VER DETALLE
          </button>
        </motion.div>
      )}
    </>
  );
};

export default PreviousBoxes;
