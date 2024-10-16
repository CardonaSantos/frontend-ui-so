import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  FileText,
  Clock,
} from "lucide-react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Tipos
type Departamento = {
  id: number;
  nombre: string;
};

type Municipio = {
  id: number;
  nombre: string;
  departamentoId: number;
};

type Cliente = {
  id: number;
  nombre: string;
  comentarios: string;
  correo: string;
  creadoEn: string;
  actualizadoEn: string;
  departamento: Departamento;
  direccion: string;
  municipio: Municipio;
  telefono: string;
  categoriasInteres: string[];
  preferenciaContacto: string;
  presupuestoMensual: string;
  tipoCliente: string;
};

type Venta = {
  id: number;
  monto: number;
  montoConDescuento: number;
  descuento: number;
  metodoPago: string;
  timestamp: string;
  usuarioId: number;
  clienteId: number;
  visitaId: number;
};

type Vendedor = {
  id: number;
  nombre: string;
  correo: string;
  creadoEn: string;
  rol: string;
};

type Visita = {
  id: number;
  inicio: string;
  fin: string;
  usuarioId: number;
  clienteId: number;
  observaciones: string;
  motivoVisita: string;
  tipoVisita: string;
  estadoVisita: string;
  creadoEn: string;
  actualizadoEn: string;
  cliente: Cliente;
  ventas: Venta[];
  vendedor: Vendedor;
};
// Componente principal
export default function VisitasTable() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  console.log("Mis visitas son: ", visitas);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/date/get-visits-regists`);
        setVisitas(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Registro de Visitas</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitas.map((visita) => (
              <TableRow key={visita.id}>
                <TableCell>{visita.cliente.nombre}</TableCell>
                <TableCell>
                  {new Date(visita.inicio).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getEstadoVariant(visita.estadoVisita)}>
                    {visita.estadoVisita}
                  </Badge>
                </TableCell>
                <TableCell>{visita.tipoVisita}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Detalles de la Visita</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[80vh]">
                        <DetallesVisita visita={visita} />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Componente para mostrar los detalles de la visita
function DetallesVisita({ visita }: { visita: Visita }) {
  // function formatTimeDifference(creadoEn: string, actualizadoEn: string) {
  //   const createdDate = new Date(creadoEn);
  //   const updatedDate = new Date(actualizadoEn);
  //   const diffMs = updatedDate.getTime() - createdDate.getTime(); // Diferencia en milisegundos

  //   const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // Diferencia en horas
  //   const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Diferencia en minutos

  //   return `${diffHrs} horas y ${diffMins} minutos`;
  // }

  const calcularDuracionVisita = (
    creadoEn: string | undefined,
    actualizadoEn: string | undefined
  ): string => {
    // Verificar si los valores están definidos antes de proceder
    if (!creadoEn || !actualizadoEn) {
      return "Información insuficiente";
    }

    const inicio = new Date(creadoEn);
    const fin = new Date(actualizadoEn);

    // Asegurarse de que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return "Fechas no válidas";
    }

    // Calcular la diferencia en milisegundos
    const diferenciaMs = fin.getTime() - inicio.getTime();

    // Convertir a horas y minutos
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

    // Verificar singular o plural en horas y minutos
    const horasTexto = horas === 1 ? "hora" : "horas";
    const minutosTexto = minutos === 1 ? "minuto" : "minutos";

    // Retornar en formato de texto en español
    return `${horas} ${horasTexto} y ${minutos} ${minutosTexto}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoSection title="Información de la Visita" icon={Calendar}>
          <p>
            <strong>Inicio:</strong> {new Date(visita.inicio).toLocaleString()}
          </p>
          <p>
            <strong>Fin:</strong> {new Date(visita.fin).toLocaleString()}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <Badge variant={getEstadoVariant(visita.estadoVisita)}>
              {visita.estadoVisita}
            </Badge>
          </p>
          <p>
            <strong>Tipo:</strong> {visita.tipoVisita}
          </p>
          <p>
            <strong>Motivo:</strong> {visita.motivoVisita}
          </p>
        </InfoSection>

        <InfoSection title="Información del Cliente" icon={User}>
          <p>
            <strong>Nombre:</strong> {visita.cliente.nombre}
          </p>
          <p>
            <strong>Tipo de Cliente:</strong> {visita.cliente.tipoCliente}
          </p>
          <p>
            <strong>Presupuesto Mensual:</strong>{" "}
            {visita.cliente.presupuestoMensual}
          </p>
          <p>
            <strong>Preferencia de Contacto:</strong>{" "}
            {visita.cliente.preferenciaContacto}
          </p>
        </InfoSection>

        <InfoSection title="Ubicación" icon={MapPin}>
          <p>
            <strong>Dirección:</strong> {visita.cliente.direccion}
          </p>
          <p>
            <strong>Municipio:</strong> {visita.cliente.municipio.nombre}
          </p>
          <p>
            <strong>Departamento:</strong> {visita.cliente.departamento.nombre}
          </p>
        </InfoSection>

        <InfoSection title="Contacto" icon={Phone}>
          <p>
            <strong>Teléfono:</strong> {visita.cliente.telefono}
          </p>
          <p>
            <strong>Correo:</strong> {visita.cliente.correo}
          </p>
        </InfoSection>

        <InfoSection title="Vendedor" icon={User}>
          <p>
            <strong>Nombre:</strong> {visita.vendedor.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {visita.vendedor.correo}
          </p>
          <p>
            <strong>Rol:</strong> {visita.vendedor.rol}
          </p>
        </InfoSection>

        <InfoSection title="Ventas" icon={DollarSign}>
          {visita.ventas.length > 0 ? (
            visita.ventas.map((venta, index) => (
              <div key={venta.id} className="mb-2">
                <p>
                  <strong>Venta {index + 1}:</strong>
                </p>
                <p>Monto: Q{venta.monto.toFixed(2)}</p>
                <p>
                  Descuento: Q
                  {venta.descuento ? venta.descuento.toFixed(2) : "N/A"}
                </p>
                <p>
                  Monto con Descuento: Q
                  {venta.montoConDescuento
                    ? venta.montoConDescuento.toFixed(2)
                    : "N/A"}
                </p>
                <p>Método de Pago: {venta.metodoPago}</p>
              </div>
            ))
          ) : (
            <p>No se registraron ventas en esta visita.</p>
          )}
        </InfoSection>
      </div>

      <InfoSection title="Observaciones" icon={FileText}>
        <p>{visita.observaciones}</p>
      </InfoSection>

      <InfoSection title="Información Adicional" icon={Clock}>
        <p>
          <strong>Creado en:</strong>{" "}
          {new Date(visita.creadoEn).toLocaleString()}
        </p>
        <p>
          <strong>Actualizado en:</strong>{" "}
          {new Date(visita.actualizadoEn).toLocaleString()}
        </p>
        <p>
          <strong>Duración de la visita:</strong>{" "}
          {calcularDuracionVisita(visita.creadoEn, visita.actualizadoEn)}
        </p>
      </InfoSection>
    </div>
  );
}

// Componente auxiliar para secciones de información
function InfoSection({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <section className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        {title}
      </h3>
      {children}
    </section>
  );
}

// Función auxiliar para obtener la variante del Badge según el estado
function getEstadoVariant(
  estado: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (estado.toLowerCase()) {
    case "completada":
      return "default";
    case "pendiente":
      return "secondary";
    case "cancelada":
      return "destructive";
    default:
      return "outline";
  }
}
