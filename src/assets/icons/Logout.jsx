import { BiLogOut, BiLogOutCircle } from "react-icons/bi";
import { useAuthStore } from "../../api/auth/auth.store";

const Logout = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // borra token y usuario
  };

  return (
    <span
      onClick={handleLogout}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <BiLogOutCircle color="#FFFF" size={30} />
    </span>
  );
};

export default Logout;
