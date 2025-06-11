"use client";

import React from "react";
import { MoreHorizontal, PenIcon, TrashIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import { deleteBookById } from "../../../api/book";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../components/ui/dialog";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Autor",
    cell: ({ row }) => (
      <div>{row.getValue("author")}</div>
    ),
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => (
      <div>{row.getValue("isbn")}</div>
    ),
  },
  {
    accessorKey: "release_date",
    header: "Fecha de publicación",
    cell: ({ row }) => {
      const value = row.getValue("release_date");
      return <div>{value ? value.slice(0, 10) : ""}</div>;
    },
  },
  {
    accessorKey: "user_name",
    header: "Creado por",
    cell: ({ row }) => (
      <div>{row.getValue("user_name")}</div>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const book = row.original;
      const [open, setOpen] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
      // Para edición
      const handleEdit = () => {
        if (table && table.options.meta && table.options.meta.onEditBook) {
          table.options.meta.onEditBook(book);
        }
      };

      const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No autenticado");
          return;
        }
        setLoading(true);
        try {
          await deleteBookById(token, book.id);
          toast.success("Libro eliminado correctamente");
          setOpen(false);
          if (table && table.options.meta && table.options.meta.refetch) {
            table.options.meta.refetch();
          } else {
            window.location.reload();
          }
        } catch (err) {
          toast.error("Error al eliminar libro");
        } finally {
          setLoading(false);
        }
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <div className="sr-only">Abrir menú</div>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <PenIcon className="text-black" />
                Editar libro
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setOpen(true)}
              >
                <TrashIcon className="text-red-600" />
                Eliminar libro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar libro?</DialogTitle>
              <DialogDescription>
                ¿Seguro que deseas eliminar <b>{book.title}</b>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={loading}
              >
                Sí, eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
