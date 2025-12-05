"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Clock, Users, Gavel, Bell, AlertCircle, CheckCircle, Calendar, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { UserRole, EstadoProceso } from "@prisma/client";
import type { ProcesoWithRelations } from "@/types/judicial";
import { ResolucionesList } from "@/components/resoluciones/resoluciones-list";
import { SentenciaView } from "@/components/sentencias/sentencia-view";

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

interface ExpedienteDigitalProps {
  procesoId: string;
  userRole: UserRole;
}

export function ExpedienteDigital({ procesoId, userRole }: ExpedienteDigitalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [proceso, setProceso] = useState<ProcesoWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProceso();
  }, [procesoId]);

  async function fetchProceso() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/procesos/${procesoId}`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes acceso a este proceso");
        }
        throw new Error("Error al cargar el proceso");
      }

      const data = await response.json();
      setProceso(data.proceso);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el proceso",
        variant: "destructive",
      });
      router.push("/dashboard/procesos");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando expediente...</p>
      </div>
    );
  }

  if (!proceso) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Expediente Digital
            </h1>
            <p className="text-muted-foreground">NUREJ: {proceso.nurej}</p>
          </div>
        </div>
        <Badge variant="default" className="text-base px-4 py-2">
          {ESTADO_LABELS[proceso.estado]}
        </Badge>
      </div>

      {/* Información General */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">NUREJ</p>
            <p className="font-semibold">{proceso.nurej}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo de Proceso</p>
            <p className="font-semibold">{proceso.tipoProceso}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Materia</p>
            <p className="font-semibold">{proceso.materia}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className="font-semibold">{ESTADO_LABELS[proceso.estado]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Juzgado</p>
            <p className="font-semibold">{proceso.juzgado.nombre}</p>
            <p className="text-xs text-muted-foreground">
              {proceso.juzgado.ciudad}, {proceso.juzgado.departamento}
            </p>
          </div>
          {proceso.cuantia && (
            <div>
              <p className="text-sm text-muted-foreground">Cuantía</p>
              <p className="font-semibold">
                Bs. {proceso.cuantia.toLocaleString("es-BO")}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Creación</p>
            <p className="font-semibold">
              {new Date(proceso.createdAt).toLocaleDateString("es-BO")}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <h3 className="text-lg font-semibold mb-4">Partes del Proceso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Parte Actora
            </p>
            <div className="space-y-1">
              <p className="font-semibold">
                {proceso.clienteActor.nombres} {proceso.clienteActor.apellidos}
              </p>
              <p className="text-sm">CI: {proceso.clienteActor.ci}</p>
              <p className="text-sm">
                Abogado: {proceso.abogadoActor.firstName}{" "}
                {proceso.abogadoActor.lastName}
              </p>
              {proceso.abogadoActor.registroProfesional && (
                <p className="text-xs text-muted-foreground">
                  Reg. Prof: {proceso.abogadoActor.registroProfesional}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Parte Demandada
            </p>
            {proceso.demandadoNombres || proceso.demandadoApellidos ? (
              <div className="space-y-1">
                <p className="font-semibold">
                  {proceso.demandadoNombres} {proceso.demandadoApellidos}
                </p>
                {proceso.demandadoCI && (
                  <p className="text-sm">CI: {proceso.demandadoCI}</p>
                )}
                {proceso.abogadoDemandado && (
                  <>
                    <p className="text-sm">
                      Abogado: {proceso.abogadoDemandado.firstName}{" "}
                      {proceso.abogadoDemandado.lastName}
                    </p>
                    {proceso.abogadoDemandado.registroProfesional && (
                      <p className="text-xs text-muted-foreground">
                        Reg. Prof: {proceso.abogadoDemandado.registroProfesional}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No especificado
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Acciones Disponibles */}
      {userRole === UserRole.ABOGADO && proceso.estado === EstadoProceso.BORRADOR && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Proceso en Borrador</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Este proceso está listo para presentar la demanda. Complete todos los campos
                  requeridos según el Art. 110 del Código Procesal Civil.
                </p>
                <Link href={`/dashboard/procesos/${procesoId}/demanda`}>
                  <Button size="lg">
                    <FileText className="h-4 w-4 mr-2" />
                    Presentar Demanda
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === UserRole.ABOGADO && proceso.estado === EstadoProceso.OBSERVADO && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Demanda Observada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  El juez ha realizado observaciones a la demanda. Debe corregirla y re-presentarla
                  dentro del plazo establecido.
                </p>
                {proceso.demanda && (
                  <div className="bg-white p-3 rounded-md mb-4 border border-orange-200">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Observaciones del Juez:
                    </p>
                    <p className="text-sm">{proceso.demanda.observaciones}</p>
                  </div>
                )}
                <Link href={`/dashboard/procesos/${procesoId}/demanda`}>
                  <Button size="lg" variant="default" className="bg-orange-500 hover:bg-orange-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Corregir Demanda
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === UserRole.ABOGADO && proceso.estado === EstadoProceso.PRESENTADO && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Demanda Presentada</h3>
                <p className="text-sm text-muted-foreground">
                  La demanda ha sido presentada y está pendiente de revisión por el juez. Será
                  admitida, observada o rechazada próximamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === UserRole.ABOGADO && proceso.estado === EstadoProceso.ADMITIDO && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Demanda Admitida</h3>
                <p className="text-sm text-muted-foreground">
                  La demanda ha sido admitida por el juez. El proceso continúa con la citación del
                  demandado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === UserRole.JUEZ &&
       (proceso.estado === EstadoProceso.CITADO ||
        proceso.estado === EstadoProceso.CONTESTADO ||
        proceso.estado === EstadoProceso.ADMITIDO) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Programar Audiencia</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {proceso.estado === EstadoProceso.CONTESTADO
                    ? "El demandado ha presentado contestación. Puede programar la audiencia preliminar para intentar conciliación y admitir pruebas."
                    : proceso.estado === EstadoProceso.CITADO
                    ? "El demandado ha sido citado exitosamente. Puede esperar la contestación o programar una audiencia preliminar."
                    : "El proceso está admitido. Puede programar una audiencia preliminar o complementaria."}
                </p>
                <Link href={`/dashboard/juez/procesos/${procesoId}/audiencia`}>
                  <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar Audiencia
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs con secciones */}
      <Tabs defaultValue="documentos" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="documentos">
            <FileText className="mr-2 h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="plazos">
            <Clock className="mr-2 h-4 w-4" />
            Plazos
          </TabsTrigger>
          <TabsTrigger value="audiencias">
            <Users className="mr-2 h-4 w-4" />
            Audiencias
          </TabsTrigger>
          <TabsTrigger value="resoluciones">
            <Gavel className="mr-2 h-4 w-4" />
            Resoluciones
          </TabsTrigger>
          <TabsTrigger value="sentencia">
            <Scale className="mr-2 h-4 w-4" />
            Sentencia
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Bell className="mr-2 h-4 w-4" />
            Línea de Tiempo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Documentos</h3>
            {proceso.documentos && proceso.documentos.length > 0 ? (
              <div className="space-y-2">
                {proceso.documentos.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{doc.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.tipo} - {new Date(doc.createdAt).toLocaleDateString("es-BO")}
                      </p>
                    </div>
                    <Badge variant="outline">{doc.visibilidad}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay documentos registrados
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="plazos">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Plazos</h3>
            {proceso.plazos && proceso.plazos.length > 0 ? (
              <div className="space-y-2">
                {proceso.plazos.map((plazo: any) => (
                  <div
                    key={plazo.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{plazo.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence:{" "}
                        {new Date(plazo.fechaVencimiento).toLocaleDateString("es-BO")}
                      </p>
                    </div>
                    <Badge>{plazo.estado}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay plazos registrados
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="audiencias">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Audiencias</h3>
            {proceso.audiencias && proceso.audiencias.length > 0 ? (
              <div className="space-y-2">
                {proceso.audiencias.map((audiencia: any) => (
                  <div
                    key={audiencia.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{audiencia.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(audiencia.fechaHora).toLocaleString("es-BO")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {audiencia.modalidad}
                      </p>
                    </div>
                    <Badge>{audiencia.estado}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay audiencias programadas
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="resoluciones">
          <ResolucionesList
            procesoId={proceso.id}
            isJuez={userRole === UserRole.JUEZ}
          />
        </TabsContent>

        <TabsContent value="sentencia">
          <SentenciaView
            procesoId={proceso.id}
            isJuez={userRole === UserRole.JUEZ}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Línea de Tiempo</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Proceso Creado</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proceso.createdAt).toLocaleString("es-BO")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estado inicial: {ESTADO_LABELS[EstadoProceso.BORRADOR]}
                  </p>
                </div>
              </div>
              {/* Más eventos de la línea de tiempo se agregarán dinámicamente */}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
