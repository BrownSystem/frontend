import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import {
  useDownloadPdfProducts,
  useDownloadPdfQrs,
} from "../../../../../../api/products/products.queries";
import { Button, GenericTable, Message } from "../../../../widgets";
import { searchProductsByBranches } from "../../../../../../api/products/products.api";
import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";

// 👉 Drag & Drop
import {
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SelecetedProductsQrModal from "../../../../../common/Modal/SelecetedProductsQrModal";
import { ReorganizeBranchesModal } from "../../../../../common";
import { useQrStore } from "../../../../../../store/useQrStore";
import { useMessageStore } from "../../../../../../store/useMessage";

// Componente para cada sucursal arrastrable
const SortableBranch = ({ branch }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: branch.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[var(--brown-ligth-200)] border border-[var(--brown-ligth-400)] rounded-xl shadow-md p-4 m-2 cursor-grab hover:bg-[var(--brown-ligth-200)] transition"
    >
      <h3 className="text-lg font-semibold text-[var(--brown-dark-900)]">
        {branch.name}
      </h3>
      <p className="text-sm text-[var(--brown-dark-700)]">{branch.location}</p>
    </div>
  );
};

const PrintQrCodeContent = () => {
  const {
    selectedProducts,
    addOrUpdateProduct,
    updateQuantity,
    removeProduct,
    setSelectedProducts,
    clearProducts,
  } = useQrStore();

  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const [search, setSearch] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalBranches, setShowModalBranches] = useState(false);
  const [pendingExport, setPendingExport] = useState(false);
  const [removeStockZero, setRemoveStockZero] = useState(false);
  const { data: branches } = useFindAllBranch();
  const [orderedBranches, setOrderedBranches] = useState([]);
  const { setMessage } = useMessageStore();

  useEffect(() => {
    if (selectedProducts && Object.keys(selectedProducts).length > 0) {
      setMessage({
        text: "YA HAY PRODUCTOS SELECCIONADOS",
        type: "info",
      });
    }
  }, [showModal]);

  // Inicializar branches cuando llegan desde el backend
  useEffect(() => {
    if (branches) {
      setOrderedBranches(branches);
    }
  }, [branches]);

  // Drag & drop sensors
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOrderedBranches((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const { mutate: downloadPdf, isPending } = useDownloadPdfQrs();
  const { mutate: downloadPdfProducts, isPendingPdfProducts } =
    useDownloadPdfProducts();

  const limit = 150;

  const {
    data: products,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProductsByBranches,
    queryKeyBase: "products",
    search,
    branchId,
    limit,
    enabled: !!branchId,
  });

  const mappedProducts = useMemo(() => {
    return products.map(({ product }) => ({
      code: product?.code,
      priceGene: product?.priceGene,
      stock: product?.stock,
      descripcion: product?.description,
      name: product?.description,
    }));
  }, [products]);

  const handleToggleSelect = (product) => {
    const exists = !!selectedProducts[product.code];
    if (exists) {
      removeProduct(product.code);
    } else {
      addOrUpdateProduct(product, 1);
    }
  };

  const handleClearSelection = () => {
    clearProducts();
    setShowModal(false);
  };

  const handleQuantityChange = (code, quantity) => {
    if (quantity > 0) {
      updateQuantity(code, quantity);
    }
  };

  const allVisibleSelected =
    visibleProducts.length > 0 &&
    visibleProducts.every((p) => selectedProducts[p.code]);

  const handleToggleAll = () => {
    if (allVisibleSelected) {
      const updated = { ...selectedProducts };
      visibleProducts.forEach((p) => delete updated[p.code]);
      setSelectedProducts(updated);
    } else {
      const updated = { ...selectedProducts };
      visibleProducts.forEach((p) => {
        updated[p.code] = {
          ...p,
          quantity: selectedProducts[p.code]?.quantity || 1,
        };
      });
      setSelectedProducts(updated);
    }
  };

  const handleOpenModal = () => {
    const toPrint = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    if (toPrint.length === 0) {
      setMessage({
        text: "Seleccione al menos un producto",
        type: "info",
      });
      return;
    }
    setShowModal(true);
  };

  const handlePrint = () => {
    const filtered = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    const toPrint = filtered.map((p) => ({
      code: p.code,
      quantity: p.quantity,
    }));

    downloadPdf(
      { products: toPrint },
      {
        onSuccess: () => {
          setShowModal(false);
        },
        onError: () => {
          alert("Hubo un error al generar el PDF.");
        },
      }
    );
  };

  // 👉 ahora no descarga directo, primero abre modal branches
  const handleDownloadProducts = () => {
    const filtered = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    if (filtered.length === 0) {
      alert("Seleccione al menos un producto para exportar.");
      return;
    }

    setPendingExport(true);
    setShowModalBranches(true);
  };

  const handleSaveBranchesOrder = () => {
    if (!pendingExport) {
      setShowModalBranches(false);
      return;
    }

    const filtered = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    const toPrint = filtered.map((p) => ({
      code: p.code,
      quantity: p.quantity,
    }));

    downloadPdfProducts(
      { products: toPrint, branchOrder: orderedBranches, removeStockZero },
      {
        onSuccess: () => {
          setShowModalBranches(false);
          setPendingExport(false);
        },
        onError: () => {
          alert("Hubo un error al generar el PDF.");
          setPendingExport(false);
        },
      }
    );
  };

  const columns = [
    { key: "code", label: "CÓDIGO" },
    { key: "name", label: "DESCRIPCIÓN" },
    {
      key: "quantity",
      label: "CANTIDAD",
      render: (_, row) =>
        selectedProducts[row.code] ? (
          <input
            type="number"
            min={1}
            value={selectedProducts[row.code]?.quantity || ""}
            onChange={(e) => handleQuantityChange(row.code, e.target.value)}
            className="w-20 text-center border border-[var(--brown-ligth-200)] rounded-lg px-2 py-1 shadow-sm focus:ring-2 focus:ring-[var(--brown-dark-700)] outline-none transition"
          />
        ) : (
          "-"
        ),
    },
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={handleToggleAll}
          title="Seleccionar todos visibles"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={!!selectedProducts[row.code]}
          onChange={() => handleToggleSelect(row)}
        />
      ),
    },
  ];

  if (!branchId) {
    return (
      <div className="text-center text-red-500 mt-8">
        No se encontró una sucursal asociada al usuario.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 py-6 px-4 bg-[var(--fill)] ">
      {/* Header */}
      <div className="w-full flex justify-around items-center">
        <h1 className="text-3xl font-bold text-[var(--brown-dark-900)]">
          DESCARGAR QR
          <span className="block text-base font-normal text-[var(--brown-ligth-400)]">
            Selecciona productos para crear un PDF
          </span>
        </h1>
        <Button text={"Visualizar Selección"} onClick={handleOpenModal} />
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Buscar producto por nombre o código..."
        className="border border-[var(--brown-dark-700)] px-4 py-3 rounded-xl shadow-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)] transition mx-auto bg-[var(--brown-ligth-50)]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <GenericTable
        columns={columns}
        data={mappedProducts}
        onVisibleDataChange={setVisibleProducts}
        enablePagination
        externalPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        paginationDisabled={isLoading}
        isLoading={isLoading}
      />

      {/* Modal de Productos Seleccionados */}
      {showModal && (
        <SelecetedProductsQrModal
          setShowModal={setShowModal}
          selectedProducts={selectedProducts}
          handleRemoveProduct={removeProduct}
          handleClearSelection={handleClearSelection}
          handlePrint={handlePrint}
          isPending={isPending}
          handleDownloadProducts={handleDownloadProducts}
          isPendingPdfProducts={isPendingPdfProducts}
        />
      )}

      {/* Modal de Sucursales con drag & drop */}
      {showModalBranches && (
        <ReorganizeBranchesModal
          handleSaveBranchesOrder={handleSaveBranchesOrder}
          sensors={sensors}
          closestCenter={closestCenter}
          handleDragEnd={handleDragEnd}
          orderedBranches={orderedBranches}
          removeStockZero={removeStockZero}
          setShowModalBranches={setShowModalBranches}
          setRemoveStockZero={setRemoveStockZero}
          verticalListSortingStrategy={verticalListSortingStrategy}
          SortableBranch={SortableBranch}
        />
      )}
    </div>
  );
};

export default PrintQrCodeContent;
