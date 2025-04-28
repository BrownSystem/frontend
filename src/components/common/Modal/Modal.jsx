const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-full w-full bg-[var(--brown-ligth-400)]/20 flex items-start justify-end">
      <div className="shadow-md w-[370px] h-full rounded-tl-4xl bg-white pt-8 px-5">
        {children}
      </div>
    </div>
  );
};

export default Modal;
