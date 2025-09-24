import { motion, AnimatePresence } from "framer-motion";
import { HideEyes, ShowEyes } from "../../../assets/icons";
import { formatFechaISO } from "../panels/stocks/content/SupplierContent/tables/InvoiceTable";

const EntryCard = ({
  icon,
  method,
  mount,
  currency,
  date,
  onClick,
  iconRemplace,
}) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-4 py-2 rounded-xl shadow-sm flex items-center justify-between gap-4 w-full font-[var(--font-outfit)] mb-2">
      <div className="flex gap-4">
        {/* Ícono */}
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          {icon}
        </div>

        {/* Texto */}
        <div>
          <h3 className="text-xs flex gap-2 font-medium text-[var(--brown-dark-700)]">
            {method}
            {date ? (
              <span className="block text-[var(--brown-dark-500)] font-normal">
                ({formatFechaISO(date)})
              </span>
            ) : null}
          </h3>
          <p className="text-md font-bold text-[var(--brown-dark-900)]">
            ${mount?.toLocaleString("es-AR")} {currency}
          </p>
        </div>
      </div>

      {/* Contenedor de los ojos */}
      {iconRemplace || (
        <motion.div
          className="cursor-pointer"
          initial="closed"
          whileHover="open"
          onClick={onClick}
        >
          <div className="flex items-center justify-center relative w-7 h-7">
            <AnimatePresence mode="wait">
              {/* Ojo cerrado */}
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

              {/* Ojo abierto */}
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
      )}
    </div>
  );
};

export default EntryCard;
