"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Plus, PenIcon } from "lucide-react";

export function UserDialog({
  form,
  loading,
  onChange,
  onSubmit,
  open,
  setOpen,
  isEdit = false,
  hideTrigger = false,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && !hideTrigger && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </DialogTrigger>
      )}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar usuario" : "Registrar nuevo usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="usuario@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
              {isEdit && " (dejar vacío para no cambiar)"}
            </label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Contraseña"
              required={!isEdit}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEdit
                  ? "Guardando..."
                  : "Creando..."
                : isEdit
                ? "Guardar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
