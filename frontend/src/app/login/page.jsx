"use client";

import React from "react";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, BookOpen, BookOpenText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { login } from "../../api/auth";
import { useRouter } from "next/navigation";
import { UserDialog } from "../(protected)/users/create-user-dialog";
import { registerUser } from "../../api/auth";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // Determinar filas y columnas según el ancho de la pantalla
  const [showGrid, setShowGrid] = useState(true);
  const [grid, setGrid] = useState({ rows: 8, cols: 10 });
  React.useEffect(() => {
    function updateGrid() {
      if (window.innerWidth < 500) {
        setShowGrid(false);
      } else if (window.innerWidth < 768) {
        setShowGrid(true);
        setGrid({ rows: 5, cols: 6 });
      } else {
        setShowGrid(true);
        setGrid({ rows: 8, cols: 10 });
      }
    }
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Llamar a la API de inicio de sesión, almacenando el token en localStorage
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en el formulario de registro
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    try {
      const result = await registerUser(registerForm);
      if (result === true || (result && !result.error)) {
        // Cerrar el dialog de registro y limpiar el formulario
        setRegisterOpen(false);
        setRegisterForm({ email: "", name: "", password: "" });
        setError("");
        setEmail(registerForm.email);
        setPassword(registerForm.password);
        // Login automático tras registro
        try {
          const data = await login({
            email: registerForm.email,
            password: registerForm.password,
          });
          localStorage.setItem("token", data.token);
          router.push("/dashboard");
        } catch (err) {
          setError("Error al iniciar sesión tras registro: ");
        }
      } else if (result && result.error) {
        if (result.error === "El correo ya está registrado") {
          setRegisterError(result.error);
        } else {
          setRegisterError(result.error);
        }
      }
    } catch (err) {
      setRegisterError("Error al registrar usuario");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#90f2ba] flex items-center justify-center p-4 relative overflow-hidden">
      {showGrid && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Grid de iconos BookOpen */}
          {[...Array(grid.rows)].map((_, row) =>
            [...Array(grid.cols)].map((_, col) => (
              <BookOpenText
                key={`bookopen-${row}-${col}`}
                className="absolute text-white opacity-90"
                style={{
                  top: `${row * (100 / grid.rows)}%`,
                  left: `${col * (100 / grid.cols)}%`,
                  width: "48px",
                  height: "48px",
                  transform: `rotate(${(row + col) % 2 === 0 ? 0 : 15}deg)`,
                }}
              />
            ))
          )}
        </div>
      )}
      
      <div className="w-full max-w-md z-10">
        <div className="w-full bg-white shadow-lg border border-emerald-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-100 px-6 py-4 space-y-1 rounded-t-lg flex justify-center items-center flex-col ">
            <div className="flex items-center justify-center mb-2 bg-white rounded-full size-20">
              <BookOpen className="h-12 w-12 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-center text-emerald-900">
              Bienvenido
            </h2>
            <h2 className="text-2xl font-semibold text-center text-emerald-900">
              Inicio de sesión
            </h2>
          </div>

          {/* Registro Dialog */}
          <UserDialog
            form={registerForm}
            loading={registerLoading}
            onChange={handleRegisterChange}
            onSubmit={handleRegisterSubmit}
            open={registerOpen}
            setOpen={setRegisterOpen}
            isEdit={false}
            hideTrigger={true}
          />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-emerald-900"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-emerald-900"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-emerald-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-emerald-600 hover:text-emerald-800 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-emerald-50 px-6 py-4 space-y-4 rounded-b-lg">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Iniciando sesión..." : "Acceder"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => setRegisterOpen(true)}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
              {registerError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{registerError}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
