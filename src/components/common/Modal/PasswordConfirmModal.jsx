const PasswordConfirmModal = ({
  onCancel,
  onConfirm,
  isLoading,
  error,
  password,
  onPasswordChange,
}) => {
  return (
    <div className="fixed inset-0 bg-[var(--brown-dark-800)]/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-center mb-4 text-[var(--brown-dark-700)]">
          Confirmar eliminación
        </h2>
        <p className="text-sm text-gray-700 mb-4 text-center">
          Ingresa tu contraseña para confirmar la acción.
        </p>

        <input
          type="password"
          className="w-full border rounded-md px-3 py-2 mb-3 text-[15px]"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-400"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-md bg-[var(--brown-dark-700)] text-white"
            onClick={() => {
              onConfirm(password);
              onCancel();
            }}
            disabled={isLoading || !password}
          >
            {isLoading ? "Verificando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmModal;
