const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="w-[370px] h-full rounded-tl-4xl bg-white pt-8 px-5">
      {children}
    </div>
  );
};

export default Modal;
