"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { EstadoProceso, MateriaProceso } from "@prisma/client";
import type { ProcesoWithRelations, PaginatedResponse } from "@/types/judicial";

const ESTADO_COLORS: Record<EstadoProceso, string> = {
  [EstadoProceso.BORRADOR]: "bg-gray-500",
  [EstadoProceso.PRESENTADO]: "bg-yellow-500",
  [EstadoProceso.OBSERVADO]: "bg-orange-500",
  [EstadoProceso.RECHAZADO]: "bg-red-500",
  [EstadoProceso.ADMITIDO]: "bg-blue-500",
  [EstadoProceso.CITADO]: "bg-cyan-500",
  [EstadoProceso.CONTESTADO]: "bg-purple-500",
  [EstadoProceso.AUDIENCIA_PRELIMINAR]: "bg-indigo-500",
  [EstadoProceso.AUDIENCIA_COMPLEMENTARIA]: "bg-violet-500",
  [EstadoProceso.PARA_SENTENCIA]: "bg-fuchsia-500",
  [EstadoProceso.SENTENCIADO]: "bg-green-500",
  [EstadoProceso.APELADO]: "bg-amber-500",
  [EstadoProceso.EJECUTORIADO]: "bg-emerald-600",
  [EstadoProceso.ARCHIVADO]: "bg-gray-400",
  [EstadoProceso.CONCILIADO]: "bg-teal-500",
};

const ESTADO_LABELS: Record<EstadoProceso, string> = {
  [EstadoProceso.BORRADOR]: "Borrador",
  [EstadoProceso.PRESENTADO]: "Presentado",
  [EstadoProceso.OBSERVADO]: "Observado",
  [EstadoProceso.RECHAZADO]: "Rechazado",
  [EstadoProceso.ADMITIDO]: "Admitido",
  [EstadoProceso.CITADO]: "Citado",
  [EstadoProceso.CONTESTADO]: "Contestado",
  [EstadoProceso.AUDIENCIA_PRELIMINAR]: "Audiencia Preliminar",
  [EstadoProceso.AUDIENCIA_COMPLEMENTARIA]: "Audiencia Complementaria",
  [EstadoProceso.PARA_SENTENCIA]: "Para Sentencia",
  [EstadoProceso.SENTENCIADO]: "Sentenciado",
  [EstadoProceso.APELADO]: "Apelado",
  [EstadoProceso.EJECUTORIADO]: "Ejecutoriado",
  [EstadoProceso.ARCHIVADO]: "Archivado",
  [EstadoProceso.CONCILIADO]: "Conciliado",
};

export function ProcesosList() {
  const router = useRouter();
  const { toast } = useToast();
  const [procesos, setProcesos] = useState<ProcesoWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("ALL");
  const [materiaFilter, setMateriaFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProcesos();
  }, [page, search, estadoFilter, materiaFilter]);

  async function fetchProcesos() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(estadoFilter && estadoFilter !== "ALL" && { estado: estadoFilter }),
        ...(materiaFilter && materiaFilter !== "ALL" && { materia: materiaFilter }),
      });

      const response = await fetch(`/api/procesos?${params}`);
      if (!response.ok) throw new Error("Error al cargar procesos");

      const data: PaginatedResponse<ProcesoWithRelations> = await response.json();
      setProcesos(data.data);
      setTotal(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los procesos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por NUREJ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={estadoFilter}
            onValueChange={(value) => {
              setEstadoFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {Object.entries(ESTADO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={materiaFilter}
            onValueChange={(value) => {
              setMateriaFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value={MateriaProceso.CIVIL}>Civil</SelectItem>
              <SelectItem value={MateriaProceso.FAMILIAR}>Familiar</SelectItem>
              <SelectItem value={MateriaProceso.COMERCIAL}>Comercial</SelectItem>
              <SelectItem value={MateriaProceso.LABORAL}>Laboral</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Procesos List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando procesos...</p>
        </div>
      ) : procesos.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron procesos</p>
        </Card>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {procesos.map((proceso) => (
              <Card
                key={proceso.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/procesos/${proceso.id}`)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{proceso.nurej}</h3>
                      <p className="text-sm text-muted-foreground">
                        {proceso.materia}
                      </p>
                    </div>
                    <Badge className={ESTADO_COLORS[proceso.estado]}>
                      {ESTADO_LABELS[proceso.estado]}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Actor:</span>{" "}
                      {proceso.clienteActor.nombres}{" "}
                      {proceso.clienteActor.apellidos}
                    </p>
                    {(proceso.demandadoNombres || proceso.demandadoApellidos) && (
                      <p>
                        <span className="font-medium">Demandado:</span>{" "}
                        {proceso.demandadoNombres} {proceso.demandadoApellidos}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Juzgado:</span>{" "}
                      {proceso.juzgado.nombre}
                    </p>
                    {proceso.cuantia && (
                      <p>
                        <span className="font-medium">Cuantía:</span> Bs.{" "}
                        {proceso.cuantia.toLocaleString("es-BO")}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Creado:{" "}
                    {new Date(proceso.createdAt).toLocaleDateString("es-BO")}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, total)} de {total} procesos
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
