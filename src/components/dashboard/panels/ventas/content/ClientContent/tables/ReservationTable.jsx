import React, { useMemo, useState } from "react";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { GenericTable, Message } from "../../../../../widgets";
import { searchReservedVouchers } from "../../../../../../../api/vouchers/vouchers.api";
import { usePaginatedTableReservationData } from "../../../../../../../hooks/usePaginatedTableReservationData";
import { useUpdateReservedStatus } from "../../../../../../../api/vouchers/vouchers.queries";

const ReservationTable = () => {
  const user = useAuthStore((state) => state.user);
  const { mutate: updateStatus } = useUpdateReservedStatus();
  const branchId = user?.branchId;
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  const limit = 4;

  const {
    data: rawData,
    offset,
    setOffset,
    isLoading,
    totalPages,
  } = usePaginatedTableReservationData({
    fetchFunction: searchReservedVouchers, // debe ser una función normal, no un hook
    queryKeyBase: "reserved-vouchers",
    search,
    limit,
    additionalParams: { emissionBranchId: branchId },
    enabled: !!branchId,
  });

  const reservas = useMemo(() => {
    if (!Array.isArray(rawData)) return [];

    return rawData.map((r) => ({
      id: r.id,
      code: r.productId,
      color: "—",
      priceGene: r.price,
      descripcion: r.description,
      name: r.description,
      entrega: {
        cliente: r.voucher.contactName,
        cantidad: r.quantity,
        estado: r.isReserved === true ? "Pendiente" : "Entregado",
        fechaReserva: new Date(r.voucher.emissionDate).toLocaleDateString(
          "es-AR"
        ),
      },
    }));
  }, [rawData]);

  const columns = [
    {
      key: "fechaReserva",
      label: "FECHA",
      className: "text-center",
      render: (_, row) => row.entrega.fechaReserva,
    },
    { key: "name", label: "DESCRIPCIÓN", className: "text-center" },
    {
      key: "cliente",
      label: "CLIENTE",
      className: "text-center",
      render: (_, row) => <span>{row.entrega.cliente}</span>,
    },

    {
      key: "cantidad",
      label: "CANTIDAD",
      className: "text-center",
      render: (_, row) => row.entrega.cantidad,
    },
    { key: "color", label: "COLOR", className: "text-center" },
    {
      key: "estado",
      label: "ESTADO",
      className: "text-center",
      render: (_, row) => (
        <select
          value={row.entrega.estado}
          onChange={(e) => {
            const newEstado = e.target.value;
            const isReserved = newEstado === "PENDIENTE";
            updateStatus(
              {
                id: row.id, // ensure this is available in the row
                isReserved,
              },
              {
                onSuccess: () => {
                  setMessage({
                    text: "Estado actualizado exitosamente.",
                    type: "success",
                  });
                  // this changes visual immediately
                },
              }
            );
          }}
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            row.entrega.estado === "PENDIENTE"
              ? "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
              : "bg-[var(--bg-state-red)] text-[var(--text-state-red)]"
          }`}
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="ENTREGADO">ENTREGADO</option>
        </select>
      ),
    },
  ];

  return (
    <div className="w-full h-full rounded-lg shadow overflow-x-auto p-2">
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={3000}
      />
      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 mb-4">
        <h2 className="text-2xl font-semibold text-[#2c2b2a]">RESERVAS</h2>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar reserva..."
          className="border px-3 py-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white px-4 py-2 rounded-b-lg shadow-sm">
        <GenericTable
          columns={columns}
          data={reservas}
          enablePagination={true}
          enableFilter={false}
          externalPagination={true}
          currentPage={offset}
          totalPages={totalPages}
          onPageChange={setOffset}
          paginationDisabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReservationTable;
