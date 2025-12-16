import { useState } from "react";
import { useCreateBoxCategory } from "../../../../../../../../../../api/box-category/box-category.queries";
import { Button, LabelInvoice, Message } from "../../../../../../../../widgets";
import { motion } from "framer-motion";
import { Lamp } from "../../../../../../../../../../assets/icons";
import { useMessageStore } from "../../../../../../../../../../store/useMessage";

const ModalCreateBoxCategory = ({
  showAddBoxCategoryModal,
  setShowAddBoxCategoryModal,
}) => {
  const createBoxCategoryMutation = useCreateBoxCategory();

  const { setMessage } = useMessageStore();
  const [name, setName] = useState("");

  const handleCreateBoxCategory = () => {
    if (!name) {
      setMessage({
        text: "Por favor completa el campo",
        type: "error",
      });
      return;
    }
    const newBoxCategoryData = {
      name,
    };

    createBoxCategoryMutation.mutate(newBoxCategoryData, {
      onSuccess: () => {
        setMessage({ text: "Categoria creada correctamente", type: "success" });
        setName("");
        setTimeout(() => {
          setShowAddBoxCategoryModal(false);
        }, 1000);
      },
      onError: () => {
        setMessage({ text: "Error al crear la categoria", type: "error" });
      },
    });
  };

  return (
    <>
      {showAddBoxCategoryModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex justify-center items-center bg-black/50"
        >
          <div className="bg-[var(--brown-ligth-50)] rounded-md w-[400px]">
            <div className="flex gap-4 items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
              <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                <Lamp size={36} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                  REGISTRAR CATEGORIA
                </h3>
                <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                  Completa los datos
                </p>
              </div>
            </div>

            {/* div con id para capturar valores */}
            <div id="boxCategoryForm" className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                <LabelInvoice text="Nombre" />
                <input
                  name="name"
                  type="text"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Agregar nombre de la categoria"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  text="Cancelar"
                  onClick={() => setShowAddBoxCategoryModal(false)}
                />
                <Button
                  text="Crear"
                  onClick={() => handleCreateBoxCategory()}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ModalCreateBoxCategory;
