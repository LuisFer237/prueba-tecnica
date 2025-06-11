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
import { toast } from "react-toastify";
import { createBook, updateBookById } from "../../../api/book";
import { BookDialog } from "./create-book-dialog";
import { BookOpen } from "lucide-react";

export function DataTable({ columns, data, meta }) {
  const [tableData, setTableData] = React.useState(data);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    author: "",
    isbn: "",
    release_date: "",
  });
  const [editForm, setEditForm] = React.useState({
    id: null,
    title: "",
    author: "",
    isbn: "",
    release_date: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario para crear un nuevo libro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Valida que los campos requeridos estén completos
      if (!form.title || !form.author || !form.isbn || !form.release_date) {
        toast.error("Por favor, completa todos los campos.");
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      const result = await createBook(token, form);

      // Maneja errores específicos de la API
      if (result && result.error === "Ya existe un libro con el mismo ISBN") {
        toast.error(result.error);
      } else if (result) {
        // Si la creación fue exitosa, resetea el formulario y cierra el diálogo
        setForm({ title: "", author: "", isbn: "", release_date: "" });
        setOpen(false);
        toast("Libro creado exitosamente", { type: "success" });
        if (meta && meta.refetch) meta.refetch();
      }
    } catch (error) {
      toast("Error al crear el libro", { type: "error" });
    }
    setLoading(false);
  };

  // Abre el dialog de edición con los datos del libro seleccionado
  const handleEditClick = (book) => {
    setEditForm({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      release_date: book.release_date,
    });
    setEditOpen(true);
  };

  // Maneja los cambios en el formulario de edición
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario de edición
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
      const { id, title, author, isbn, release_date } = editForm;
      const payload = { title, author, isbn, release_date };
      const result = await updateBookById(token, id, payload);

      // Maneja errores específicos de la API
      if (result && result.error === "Ya existe un libro con el mismo ISBN") {
        toast.error(result.error);
      } else if (result && result.message) {
        setEditOpen(false);
        toast.success("Libro actualizado correctamente");
        if (meta && meta.refetch) meta.refetch();
      } else if (result && result.error) {
        toast.error(result.error);
      } else {
        toast.error("Error al actualizar libro");
      }
    } catch (err) {
      toast.error("Error al actualizar libro");
    } finally {
      setEditLoading(false);
    }
  };

  // Maneja el loader de la tabla
  React.useEffect(() => {
    setLoadingData(true);
    const timeout = setTimeout(() => setLoadingData(false), 500);
    return () => clearTimeout(timeout);
  }, [data]);

  // Actualiza los datos de la tabla cuando cambian
  React.useEffect(() => {
    setTableData([...data].reverse());
  }, [data]);

  // Configura la tabla con react-table
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      ...meta,
      onEditBook: handleEditClick,
    },
  });

  return (
    <div className="">
      <div className="flex items-center justify-end py-4">
        <BookDialog
          form={form}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          open={open}
          setOpen={setOpen}
          isEdit={false}
        />
        <BookDialog
          form={editForm}
          loading={editLoading}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          open={editOpen}
          setOpen={setEditOpen}
          isEdit={true}
          hideTrigger={true}
        />
      </div>
      <div className="rounded-md border overflow-x-auto min-h-[120px]">
        <Table className="min-w-full text-xs md:text-sm">
          <TableHeader className="bg-emerald-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                ))}
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
                      Cargando libros...
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
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay libros
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      No se encontraron libros en el sistema.
                      <br />
                      Los libros aparecerán aquí una vez que sean agregados.
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
