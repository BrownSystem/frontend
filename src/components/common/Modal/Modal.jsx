const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-[99999] h-full w-full bg-[var(--brown-ligth-400)]/20 flex items-center justify-center">
      <div className="shadow-md w-[400px] h-[400px] rounded-lg bg-white pt-8 px-5">
        {children}
      </div>
    </div>
  );
};

export default Modal;
