"use client";

import { useRouter } from "next/navigation";
import { Book, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useUser } from "../layout.jsx";

export default function Dashboard() {
  const router = useRouter();
  const user = useUser();

  const handleBooks = () => {
    router.push("/books");
  };

  const handleUsers = () => {
    router.push("/users");
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full max-w-3xl p-6">
        {/* Libros */}
        <div className="hover:shadow-lg transition-shadow shadow-sm duration-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center">
          <Book className="h-12 w-12 text-emerald-600 mb-2" />
          <span className="text-lg font-medium text-emerald-900 mb-4">Libros</span>
          <Button
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleBooks}
          >
            Gestionar Libros
          </Button>
        </div>
        {/* Usuarios */}
        <div className="hover:shadow-lg transition-shadow shadow-sm duration-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center">
          <Users className="h-12 w-12 text-emerald-600 mb-2" />
          <span className="text-lg font-medium text-emerald-900 mb-4">Usuarios</span>
          <Button
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleUsers}
          >
            Gestionar Usuarios
          </Button>
        </div>
      </div>
    </>
  );
}
