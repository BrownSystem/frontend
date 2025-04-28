import { Outlet } from "react-router-dom";
import { useProductModal } from "../store/ProductModalContext";
import { sofa } from "../assets";
import { Close } from "../assets/icons";
import { StockIcon } from "../assets/icons/Icon";
import TopBar from "../components/dashboard/layout/TopBar";
import Sidebar from "../components/dashboard/layout/Sidebar";
import LayoutPanel from "../components/dashboard/layout/LayoutPanel";
import { Modal, TextModal } from "../components/common";
const Dashboard = () => {
  const { isOpen, product, closeModal } = useProductModal();

  return (
    <div className="font-outfit bg-[var(--brown-ligth-100)]">
      <div
        className="w-screen h-screen flex relative"
        style={{ gridTemplateColumns: "75% 25%" }}
      >
        <div className="w-full h-full flex flex-col">
          <TopBar />
          <div className="h-full flex">
            <Sidebar />
            <LayoutPanel>
              <Outlet />
            </LayoutPanel>
          </div>
        </div>
        <Modal isOpen={isOpen}>
          <div className="">
            {/* <!-- CAROUSEL PRODUCTS --> */}
            <div className="text-gray-600">
              <h2 className="text-1xl mb-4 flex justify-between">
                Proximo a agotar{" "}
                <span className="cursor-pointer" onClick={closeModal}>
                  <Close />
                </span>
              </h2>

              <div className="flex justify-center items-center x-auto pb-4">
                <div className="relative z-[1] min-w-[140px] max-h-auto rounded-xl overflow-hidden before:content-[''] before:absolute before:bottom-0 before:rounded-xl before:z-[-2] before:bg-[var(--brown-ligth-100)] before:w-full before:h-[95px]">
                  <div className="flex items-center justify-center">
                    <span className="text-white font-bold text-xl w-[150px]">
                      <img src={sofa} alt="" className="w-[150px]" />
                    </span>
                  </div>
                  <div className="p-2 pt-0 text-sm text-center flex flex-col gap-4">
                    <p className="font-medium text-gray-700 text-[18px] leading-4">
                      {product?.description}
                    </p>
                    <p className="text-gray-500 text-sm leading-2 pb-2">
                      180 x 80 x 69 cm
                    </p>
                  </div>
                </div>
                {/* <!-- PRODUCT CARD --> */}
              </div>
            </div>

            {/* <!-- INFORMATIONS PRODUCTS --> */}
            <div className="max-h-full w-full mt-5 text-gray-800 flex flex-col gap-4 pb-2">
              <TextModal
                inf={"Codigo"}
                content={product?.code}
                contentIcon={false}
              />
              <TextModal
                inf={"Descripcion"}
                content={product?.description}
                contentIcon={false}
              />
              <TextModal
                inf={"Stock"}
                content={product?.stock}
                contentIcon={true}
              />
              <TextModal
                inf={"Color Tela"}
                content={product?.color}
                contentIcon={false}
              />
              <TextModal
                inf={"Precio"}
                content={`$${product?.priceGene}`}
                contentIcon={false}
              />
            </div>
            {/* <!-- INFORMATIONS PRODUCTS --> */}

            <div className="w-full border-t-[.6px] border-gray-500 p-2 gap-3 flex flex-col">
              <div className="flex justify-between">
                <p className="text-gray-800">Hyper (Córdoba)</p>
                <p className="text-gray-500 justify-self-end flex justify-center items-center">
                  10
                  <span>
                    {4 < 2 ? <StockIcon type="low" /> : <StockIcon type="ok" />}
                  </span>
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-800">Sinsacate</p>
                <p className="text-gray-500 justify-self-end flex justify-center items-center">
                  5
                  <span>
                    {4 < 2 ? <StockIcon type="low" /> : <StockIcon type="ok" />}
                  </span>
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-800">Mar de plata</p>
                <p className="text-gray-500 justify-self-end flex justify-center items-center">
                  4
                  <span>
                    {4 < 2 ? <StockIcon type="low" /> : <StockIcon type="ok" />}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[var(--brown-ligth-400)] p-2 w-full rounded-md text-white text-center shadow-md cursor-pointer mt-5">
              Pedir el producto
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
