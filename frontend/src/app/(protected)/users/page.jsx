"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllUsers } from "../../../api/user";

export default function UsersPage() {
  const [data, setData] = useState([]);

  // Función para obtener los datos de los usuarios
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const users = await getAllUsers(token);
      setData(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name || "Sin nombre",
        }))
      );
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-2 md:mx-auto py-5">
      <DataTable columns={columns} data={data} meta={{ refetch: fetchData }} />
    </div>
  );
}
