import { useState } from "react";
import { useLogin } from "../api/auth/auth.queries";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react"; // 👈 Importo los íconos

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
      await loginMutation.mutateAsync({ email, password });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--brown-ligth-200)] via-[var(--brown-ligth-100)] to-[var(--brown-ligth-400)] px-4">
      <div className="bg-[var(--brown-ligth-50)] shadow-2xl rounded-2xl p-8 w-full max-w-md border border-[var(--brown-ligth-400)]">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-[var(--brown-dark-900)] mb-2 font-outfit">
          Bienvenido
        </h1>
        <p className="text-center text-[var(--brown-dark-800)] mb-6 text-sm">
          Ingresa tus credenciales para acceder a{" "}
          <span className="font-semibold text-[var(--brown-dark-950)]">
            BOSQUE S.R.L.
          </span>
        </p>

        {/* Error global */}
        {errors.global && (
          <div className="mb-4 text-sm text-[var(--text-state-red)] bg-[var(--bg-state-red)] border border-red-200 p-2 rounded-lg text-center">
            {errors.global}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[var(--brown-dark-800)] mb-1"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--brown-ligth-400)]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm font-outfit bg-[var(--brown-ligth-50)] placeholder-[var(--brown-dark-500)] ${
                  errors.email
                    ? "border-[var(--text-state-red)]"
                    : "border-[var(--brown-dark-500)]"
                } focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]`}
                placeholder="ejemplo@correo.com"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                className="text-xs text-[var(--text-state-red)] mt-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[var(--brown-dark-800)] mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--brown-ligth-400)]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm font-outfit bg-[var(--brown-ligth-50)] placeholder-[var(--brown-dark-500)] ${
                  errors.password
                    ? "border-[var(--text-state-red)]"
                    : "border-[var(--brown-dark-500)]"
                } focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]`}
                placeholder="********"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-xs text-[var(--brown-dark-500)] hover:text-[var(--brown-dark-800)]"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="text-xs text-[var(--text-state-red)] mt-1"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-[var(--brown-dark-800)] hover:bg-[var(--brown-dark-900)] transition flex items-center justify-center shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Cargando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
