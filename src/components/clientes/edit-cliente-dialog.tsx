"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { ClienteData } from "@/types/judicial";

const updateClienteSchema = z.object({
  ci: z.string().min(5, "CI debe tener al menos 5 caracteres"),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres"),
  edad: z.string().optional(),
  estadoCivil: z.string().optional(),
  profesion: z.string().optional(),
  domicilioReal: z.string().min(5, "Domicilio real es requerido"),
  domicilioProcesal: z.string().min(5, "Domicilio procesal es requerido"),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 dígitos").optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

type UpdateClienteFormValues = z.infer<typeof updateClienteSchema>;

interface EditClienteDialogProps {
  cliente: ClienteData;
  open: boolean;
  onClose: () => void;
}

export function EditClienteDialog({
  cliente,
  open,
  onClose,
}: EditClienteDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateClienteFormValues>({
    resolver: zodResolver(updateClienteSchema),
    defaultValues: {
      ci: cliente.ci,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      edad: cliente.edad?.toString() || "",
      estadoCivil: cliente.estadoCivil || "",
      profesion: cliente.profesion || "",
      domicilioReal: cliente.domicilioReal,
      domicilioProcesal: cliente.domicilioProcesal,
      telefono: cliente.telefono || "",
      email: cliente.email || "",
    },
  });

  useEffect(() => {
    if (open && cliente) {
      form.reset({
        ci: cliente.ci,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        edad: cliente.edad?.toString() || "",
        estadoCivil: cliente.estadoCivil || "",
        profesion: cliente.profesion || "",
        domicilioReal: cliente.domicilioReal,
        domicilioProcesal: cliente.domicilioProcesal,
        telefono: cliente.telefono || "",
        email: cliente.email || "",
      });
    }
  }, [open, cliente, form]);

  async function onSubmit(data: UpdateClienteFormValues) {
    setIsLoading(true);

    try {
      const payload: any = {
        ...data,
        edad: data.edad ? parseInt(data.edad) : null,
        telefono: data.telefono || null,
        email: data.email || null,
        estadoCivil: data.estadoCivil || null,
        profesion: data.profesion || null,
      };

      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar cliente");
      }

      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado exitosamente",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el cliente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Actualiza los datos del cliente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ci"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CI *</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres *</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Carlos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez García" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estadoCivil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <FormControl>
                      <Input placeholder="Soltero" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profesion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profesión</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingeniero" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="70123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="domicilioReal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domicilio Real *</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Principal #123, Zona Sur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domicilioProcesal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domicilio Procesal *</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Secundaria #456, Zona Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
