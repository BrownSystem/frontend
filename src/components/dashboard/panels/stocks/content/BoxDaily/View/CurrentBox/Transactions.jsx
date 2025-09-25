import { FiRefreshCcw } from "react-icons/fi";
import {
  Comprobantes,
  HideEyes,
  Initial,
  InvoiceIcon,
  Lamp,
  NotFound,
  ShowEyes,
  Social,
  TransactionsIcon,
} from "../../../../../../../../assets/icons";
import { StockIcon } from "../../../../../../../../assets/icons/Icon";
import { Button } from "../../../../../../widgets";
import { motion, AnimatePresence } from "framer-motion";

const Transactions = () => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-4 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex gap-4 items-center border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          <TransactionsIcon size={31} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
            TRANSACCIONES
          </h3>
          <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
            Movimientos Recientes
          </p>
        </div>
      </div>

      {/* Contenido dinámico */}
      {/* <div className="flex-1 flex items-center justify-center">
        <NotFound text="La caja no está abierta" sizeText="text-md" />
      </div> */}

      {/* Contenido dinámico */}
      <div className="flex-1 mt-4">
        {/* SALDO INICIAL */}
        <div className="bg-[var(--bg-state-green)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-green-ligth)] p-2 rounded-full">
              <Initial />
            </div>

            {/* INFORMACION */}
            <div className="flex flex-col items-start">
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-green)] flex justify-center items-center">
                  $30.000,40 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"up"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                SALDO INICIAL
              </h3>
            </div>
          </div>
          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(9:35 am)</p>
          </div>
          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        {/* INGRESO POR SUCURSAL */}
        <div className="bg-[var(--bg-state-green)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-green-ligth)] p-2 rounded-full">
              <Social />
            </div>

            {/* INFORMACION */}
            <div className="flex flex-col items-start">
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-green)] flex justify-center items-center">
                  $30.000,40 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"up"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                GRUPO MEGA (CHEQUE)
              </h3>
            </div>
          </div>
          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(9:35 am)</p>
          </div>
          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* INGRESO DE VENTAS */}
        <div className="bg-[var(--bg-state-green)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-green-ligth)] p-2 rounded-full">
              <InvoiceIcon />
            </div>
            <div>
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-green)] flex justify-center items-center">
                  $5.000,00 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"up"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                P-0001 (EFECTIVO)
              </h3>
            </div>
          </div>
          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(10:00 am)</p>
          </div>
          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* PAGOS AL PROVEEDOR*/}
        <div className="bg-[var(--bg-state-red)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-red-ligth)] p-2 rounded-full">
              <InvoiceIcon />
            </div>
            <div>
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-red)] flex justify-center items-center">
                  $2.500,00 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"low"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                F-0001 (EFECTIVO)
              </h3>
            </div>
          </div>

          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(10:15 am)</p>
          </div>

          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* GASTOS POR CATEGORIA */}
        <div className="bg-[var(--bg-state-red)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-red-ligth)] p-2 rounded-full">
              <Lamp />
            </div>
            <div>
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-red)] flex justify-center items-center">
                  $2.500.000,00 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"low"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                FERRETERIA (EFECTIVO)
              </h3>
            </div>
          </div>

          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(10:45 am)</p>
          </div>
          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* INGRESO DE VENTAS */}
        <div className="bg-[var(--bg-state-green)] px-2 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
          <div className="flex gap-4">
            <div className="bg-[var(--text-state-green-ligth)] p-2 rounded-full">
              <InvoiceIcon />
            </div>
            <div>
              <p className="text-md font-bold text-[var(--brown-dark-900)]">
                <span className="text-[var(--text-state-green)] flex justify-center items-center">
                  $5.000.000,00 <span className="pl-1">ARS</span>{" "}
                  <span className="pl-1">
                    {" "}
                    <StockIcon type={"up"} />{" "}
                  </span>
                </span>{" "}
              </p>
              <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-800)]">
                P-0012 (TARJETA)
              </h3>
            </div>
          </div>
          {/* HORA */}
          <div className="self-start pt-1">
            <p className="text-xs text-[var(--brown-dark-800)]">(11:30 am)</p>
          </div>
          {/* Contenedor de los ojos */}
          <motion.div
            className="cursor-pointer"
            initial="closed"
            whileHover="open"
          >
            <div className="flex items-center justify-center relative w-7 h-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer fijo abajo */}
      <div className="p-4 mt-auto">
        <Button text="Abrir Caja" width="w-full" />
      </div>
    </div>
  );
};

export default Transactions;
