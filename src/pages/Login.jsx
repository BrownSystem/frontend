import { useState } from "react";
import { useLogin } from "../api/auth/auth.queries";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Correo inválido.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 4) {
      newErrors.password = "Debe tener al menos 4 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Ocurrió un error en el inicio de sesión.";
      setErrors((prev) => ({
        ...prev,
        global: msg,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brown-dark-950)] flex items-center justify-center relative overflow-hidden font-[var(--font-outfit)]">
      {/* Círculos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--brown-dark-500)] rounded-full opacity-30 blur-[60px] z-2" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--brown-ligth-300)] rounded-full opacity-20 blur-[100px] z-2" />
      <div className="absolute inset-0 bg-[var(--brown-dark-700)] opacity-20 [clip-path:polygon(0_0,100%_30%,100%_100%,0_100%)] z-2" />

      {/* Card */}
      <div className="bg-[var(--brown-dark-800)] rounded-2xl p-8 w-full max-w-sm z-10 text-white border border-[var(--brown-dark-900)]">
        <h1 className="text-3xl font-bold text-center mb-6">Bosque S.R.L.</h1>

        {errors.global && (
          <div className="mb-4 text-sm text-[var(--text-state-red)] bg-[var(--bg-state-red)] p-2 rounded">
            {errors.global}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-sm mb-1 text-[var(--brown-ligth-200)]"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg bg-[var(--brown-dark-700)] text-white placeholder-[var(--brown-ligth-400)] border ${
                errors.email
                  ? "border-[var(--bg-state-red)]"
                  : "border-[var(--brown-dark-500)]"
              } focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]`}
              placeholder="ejemplo@correo.com"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña con mostrar/ocultar */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-[var(--brown-ligth-200)]"
            >
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-20 rounded-lg bg-[var(--brown-dark-700)] text-white placeholder-[var(--brown-ligth-400)] border ${
                errors.password
                  ? "border-[var(--bg-state-red)]"
                  : "border-[var(--brown-dark-500)]"
              } focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]`}
              placeholder="********"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-[36px] right-3 text-sm text-[var(--brown-ligth-300)] hover:text-[var(--brown-ligth-100)]"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition cursor-pointer ${
              loading
                ? "bg-[var(--brown-ligth-300)] text-[var(--brown-dark-950)] opacity-60 cursor-not-allowed"
                : "bg-[var(--brown-ligth-200)] text-[var(--brown-dark-950)] hover:bg-[var(--brown-ligth-100)]"
            }`}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a className="text-sm text-[var(--brown-ligth-300)] hover:underline font-medium cursor-pointer">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
