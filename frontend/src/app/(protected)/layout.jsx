"use client";
import "../globals.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { LogOut, User, Home, BookOpen } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "../../api/user";

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    let timeoutId;
    getUserInfo(token)
      .then((data) => {
        setUser(data);
        timeoutId = setTimeout(() => setLoading(false), 1000);
      })
      .catch(() => router.push("/login"));
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Determinar el título según la ruta
  let pageTitle = "Dashboard";
  let pageDescription = "Panel de control principal";
  if (pathname.includes("/books")) {
    pageTitle = "Libros";
    pageDescription = "Gestiona los libros";
  } else if (pathname.includes("/users")) {
    pageTitle = "Usuarios";
    pageDescription = "Gestiona los usuarios";
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-6">
              {/* Icono de libro */}
              <BookOpen className="h-12 w-12 text-emerald-700" />
            </span>
            <span className="text-emerald-700 text-lg font-semibold">
              Cargando...
            </span>
          </div>
          <span className="animate-spin rounded-full border-4 border-emerald-600 border-t-transparent h-12 w-12 inline-block" />
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <ToastContainer />
      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-white border-b border-emerald-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="p-2 rounded-full border-2 size-10 shadow-sm hover:shadow-md"
                onClick={() => router.push("/dashboard")}
                aria-label="Ir al inicio"
              >
                <Home className="h-6 w-6 text-emerald-700" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-emerald-900">
                  {pageTitle}
                </h1>
                <p className="text-sm text-emerald-600">{pageDescription}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user ? user.name : "Usuario"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user ? user.email : "usuario@ejemplo.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex items-center justify-center w-full h-full">
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
}
