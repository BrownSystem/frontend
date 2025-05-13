/* eslint-disable no-constant-condition */
import { Outlet } from "react-router-dom";
import { useProductModal } from "../store/ProductModalContext";
import { noImage } from "../assets";
import { Close } from "../assets/icons";
import { StockIcon } from "../assets/icons/Icon";
// import TopBar from "../components/dashboard/layout/TopBar";
import Sidebar from "../components/dashboard/layout/Sidebar";
import LayoutPanel from "../components/dashboard/layout/LayoutPanel";
import { Modal, TextModal } from "../components/common";
import { useStockViewStore } from "@store/useStockViewStore";

const Dashboard = () => {
  const { isOpen, product, closeModal } = useProductModal();
  const setView = useStockViewStore((state) => state.setViewSafe);
  const handleCardClick = () => {
    setView({ name: "depositos" });
    closeModal();
  };
  return (
    <div className="font-outfit">
      <div
        className="bg-[var(--brown-ligth-100)] flex relative"
        style={{ gridTemplateColumns: "75% 25%" }}
      >
        <div className="w-full h-full flex flex-col">
          {/* <TopBar className="hidden" /> */}
          <div className="h-full w-full flex mt-[4rem] mb-4">
            <Sidebar />
            <LayoutPanel>
              <Outlet />
            </LayoutPanel>
          </div>
        </div>

        <Modal isOpen={isOpen}>
          <div className="flex">
            <div className="flex w-[500px] p-4 flex-col justify-center items-center ">
              <img
                src={`${product?.image || noImage}`}
                alt="Mesa de Roble Macizo"
                className="rounded-xl object-cover w-[300px]"
              />
            </div>
            <div className="w-1/2 p-2 relative">
              <div
                className="absolute top-[-18px] flex justify-end w-full cursor-pointer"
                onClick={closeModal}
              >
                <Close />
              </div>
              <h2 className="text-2xl font-bold text-[#3a2e1f]">
                {product?.name}
              </h2>
              <p className="text-sm text-[var(--brown-dark-700)] mb-4">
                {product?.descripcion}
              </p>
              <hr className="border-t border-[#d2b48c] mb-4" />

              <div className="text-[15px] text-gray-800">
                <TextModal
                  inf={"Codigo"}
                  content={product?.code}
                  contentIcon={false}
                />
                <TextModal
                  inf={"Color"}
                  content={product?.color}
                  contentIcon={false}
                />
                <TextModal
                  inf={"Stock"}
                  content={product?.stock}
                  contentIcon={true}
                />

                <div className="mb-4">
                  <span className="font-semibold text-[var(--brown-dark-950)]">
                    Stock por depósito:
                  </span>
                  <ul className="ml-4 mt-1">
                    <li>
                      <div className="flex">
                        <span className="font-semibold">Hyper (Córdoba): </span>
                        <span className="flex items-center pl-1">
                          5{" "}
                          {4 < 2 ? (
                            <StockIcon type="low" />
                          ) : (
                            <StockIcon type="ok" />
                          )}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex">
                        <span className="font-semibold">Sinsacate: </span>
                        <span className="flex items-center pl-1">
                          1{" "}
                          {1 < 2 ? (
                            <StockIcon type="low" />
                          ) : (
                            <StockIcon type="ok" />
                          )}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex">
                        <span className="font-semibold">Mar de plata: </span>
                        <span className="flex items-center pl-1">
                          5{" "}
                          {2 < 2 ? (
                            <StockIcon type="low" />
                          ) : (
                            <StockIcon type="ok" />
                          )}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleCardClick()}
                className="cursor-pointer mt-2 bg-[var(--brown-dark-900)] hover:bg-[#b17f35] text-white font-semibold py-2 px-4 rounded-xl w-full"
              >
                Pedir el producto
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
