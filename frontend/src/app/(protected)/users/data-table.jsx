"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { UserDialog } from "./create-user-dialog";
import { registerUser } from "../../../api/auth";
import { updateUserById } from "../../../api/user";
import { toast } from "react-toastify";
import { Users as UsersIcon } from "lucide-react";

export function DataTable({ columns, data, meta }) {
  const [tableData, setTableData] = React.useState(data);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", name: "", password: "" });
  const [editForm, setEditForm] = React.useState({
    id: null,
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  // Maneja el clic en el botón de editar
  const handleEditClick = (user) => {
    setEditForm({
      id: user.id,
      email: user.email,
      name: user.name,
      password: "",
    });
    setEditOpen(true);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      ...meta,
      onEditUser: handleEditClick,
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("Completa todos los campos.");
        setLoading(false);
        return;
      }

      const result = await registerUser(form);
      if (result === true) {
        setForm({ email: "", name: "", password: "" });
        setOpen(false);
        toast("Usuario creado exitosamente", { type: "success" });

        // Actualizar la tabla de usuarios después de agregar uno nuevo
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            const { getAllUsers } = await import("../../../api/user");
            const users = await getAllUsers(token);
            setTableData([...users].reverse());
          }
        }
      } else if (result && result.error === "El correo ya está registrado") {
        toast("El correo ya está registrado", { type: "error" });
      }
    } catch (error) {
      if (error?.response?.data?.error === "El correo ya está registrado") {
        toast("El correo ya está registrado", { type: "error" });
      } else {
        console.error("Error al registrar el usuario:", error);
        toast("Error al registrar el usuario", { type: "error" });
      }
    }

    setLoading(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No autenticado");
        setEditLoading(false);
        return;
      }
      const { id, email, name, password } = editForm;
      const payload = { email, name };
      if (password) payload.password = password;
      await updateUserById(token, id, payload);
      setEditOpen(false);
      toast.success("Usuario actualizado correctamente");
      if (meta && meta.refetch) meta.refetch();
    } catch (err) {
      if (err.message === "EMAIL_EXISTS") {
        toast.error("El correo ya está registrado");
      } else {
        toast.error("Error al actualizar usuario");
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Loader para la tabla
  React.useEffect(() => {
    setLoadingData(true);
    const timeout = setTimeout(() => setLoadingData(false), 500);
    return () => clearTimeout(timeout);
  }, [data]);

  React.useEffect(() => {
    setTableData([...data].reverse());
  }, [data]);

  // Obtener el ID del usuario actual desde el token
  const currentToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let currentUserId = null;
  if (currentToken) {
    try {
      const payload = JSON.parse(atob(currentToken.split(".")[1]));
      currentUserId = payload.id;
    } catch (e) {
      currentUserId = null;
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <UserDialog
          form={form}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          open={open}
          setOpen={setOpen}
          isEdit={false}
        />
        <UserDialog
          form={editForm}
          loading={editLoading}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          open={editOpen}
          setOpen={setEditOpen}
          isEdit={true}
        />
      </div>
      <div className="rounded-md border overflow-x-auto min-h-[120px]">
        <Table className="min-w-full text-xs md:text-sm">
          <TableHeader className="bg-emerald-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-emerald-600 text-white px-2 md:px-4 py-2"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadingData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <div className="w-full flex justify-center items-center py-16">
                    <span className="animate-spin rounded-full border-4 border-emerald-600 border-t-transparent h-10 w-10 inline-block mr-3"></span>
                    <span className="text-emerald-600 font-medium text-lg">
                      Cargando usuarios...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !loadingData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <UsersIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay usuarios
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      No se encontraron usuarios en el sistema.
                      <br />
                      Los usuarios aparecerán aquí una vez que sean agregados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
