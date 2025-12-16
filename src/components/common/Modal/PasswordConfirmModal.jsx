import { Unlock } from "../../../assets/icons";
import { Button } from "../../dashboard/widgets";
import { AnimatePresence, motion } from "framer-motion";

const PasswordConfirmModal = ({
  onCancel,
  onConfirm,
  isLoading,
  error,
  password,
  onPasswordChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-[999999999]"
    >
      <div className="bg-[var(--brown-ligth-50)] rounded-md w-[400px]">
        <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
          <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
            <Unlock size={30} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
              CONFIRMAR ELIMINACION
            </h3>
            <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
              Ingresa tu contraseña para confirmar la acción.
            </p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 mb-3 text-[15px]"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm mb-3">Credenciales inválidas</p>
          )}

          <div className="flex justify-end gap-2">
            <Button text={"Cancelar"} onClick={onCancel} disabled={isLoading} />
            <Button
              text={isLoading ? "Verificando..." : "Confirmar"}
              onClick={() => onConfirm(password)} // 👈 ya no se cierra acá
              disabled={isLoading || !password}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordConfirmModal;
