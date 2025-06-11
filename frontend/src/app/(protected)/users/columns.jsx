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
import { deleteUserById } from "../../../api/user";
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

// Objeto de columnas para la tabla de usuarios
export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-center">{row.getValue("id")}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="lowercase">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return (
        <div>
          {name ? (
            <span>{name}</span>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Sin nombre
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const user = row.original;
      const [open, setOpen] = React.useState(false);
      const [loading, setLoading] = React.useState(false);

      const handleEdit = () => {
        if (table && table.options.meta && table.options.meta.onEditUser) {
          table.options.meta.onEditUser(user);
        }
      };

      const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No autenticado");
          return;
        }
        // Detecta si el usuario a borrar es el logeado
        let currentUserId = null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = payload.id;
        } catch (e) {
          currentUserId = null;
        }
        if (user.id === currentUserId) {
          toast.error("No puedes eliminar tu propio usuario mientras estás logeado.");
          return;
        }
        setLoading(true);
        try {
          await deleteUserById(token, user.id);
          toast.success("Usuario eliminado correctamente");
          setOpen(false);
          if (table && table.options.meta && table.options.meta.refetch) {
            table.options.meta.refetch();
          } else {
            window.location.reload();
          }
        } catch (err) {
          if (err.message === "USER_HAS_BOOKS") {
            toast.error(
              "No se puede eliminar el usuario porque tiene libros asociados."
            );
          } else {
            toast.error("Error al eliminar usuario");
          }
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
                Editar usuario
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setOpen(true)}
              >
                <TrashIcon className="text-red-600" />
                Eliminar usuario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar usuario?</DialogTitle>
              <DialogDescription>
                ¿Seguro que deseas eliminar a <b>{user.name || user.email}</b>?
                Esta acción no se puede deshacer.
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
