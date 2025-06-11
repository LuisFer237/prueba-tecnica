"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Plus } from "lucide-react";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "../../../components/ui/label";

export function BookDialog({
  form,
  loading,
  onChange,
  onSubmit,
  open,
  setOpen,
  isEdit = false,
  hideTrigger = false,
}) {
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [date, setDate] = React.useState(
    form.release_date ? new Date(form.release_date) : undefined
  );

  React.useEffect(() => {
    if (
      form.release_date &&
      (!date || form.release_date !== date.toISOString().slice(0, 10))
    ) {
      setDate(new Date(form.release_date));
    }
  }, [form.release_date]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setDatePickerOpen(false);
    if (selectedDate) {
      onChange({
        target: {
          name: "release_date",
          value: selectedDate.toISOString().slice(0, 10),
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && !hideTrigger && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Libro
          </Button>
        </DialogTrigger>
      )}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar libro" : "Registrar nuevo libro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <Input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              placeholder="Título del libro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <Input
              name="author"
              value={form.author}
              onChange={onChange}
              required
              placeholder="Autor del libro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <Input
              name="isbn"
              value={form.isbn}
              onChange={onChange}
              required
              placeholder="ISBN"
            />
          </div>
          <div>
            <Label htmlFor="release_date" className="block text-sm font-medium mb-1">
              Fecha de publicación
            </Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="release_date"
                  className="w-full justify-between font-normal"
                  type="button"
                >
                  {date ? date.toLocaleDateString() : "Selecciona la fecha"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={handleDateChange}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Guardando..." : "Agregando...") : isEdit ? "Guardar" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
