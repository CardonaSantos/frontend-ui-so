import { useState, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  User,
  Coins,
  ShoppingCart,
  Timer,
  LocateIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

import { toast } from "sonner";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
const API_URL = import.meta.env.VITE_API_URL;

// Tipos
type Vendedor = {
  correo: string;
  id: number;
  nombre: string;
  rol: string;
};

type Ubicacion = {
  creadoEn: string;

  id: number;
  latitud: number;
  longitud: number;
  prospectoId: number;
};

type Municipio = {
  id: number;
  nombre: string;
  departamentoId: string;
};

type Departamento = {
  id: number;
  nombre: string;
};

type Prospecto = {
  id: number;
  inicio: string;
  fin: string | null;
  usuarioId: number;
  clienteId: number | null;
  nombreCompleto: string;
  empresaTienda: string;
  telefono: string;
  correo: string;
  direccion: string;
  municipioId: number;
  departamentoId: number;
  tipoCliente: string;
  categoriasInteres: string[];
  volumenCompra: string;
  presupuestoMensual: string;
  preferenciaContacto: string;
  comentarios: string;
  creadoEn: string;
  actualizadoEn: string;
  estado: string;
  vendedor: Vendedor;
  municipio: Municipio;
  departamento: Departamento;
  ubicacion: Ubicacion;
};

export default function ProspectoHistorial() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [prospectos2, setProspectos2] = useState<Prospecto[]>([]); // Inicializado como arreglo vacío

  const [selectedDepartamento, setSelectedDepartamento] = useState<
    number | null
  >(null);
  const [expandedProspect, setExpandedProspect] = useState<number | null>(null);

  const [filtros, setFiltros] = useState({
    direccion: "",
    municipio: "",
    departamento: "",
    estado: "",
    tipoCliente: "",
  });

  const getDepartamentos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/customer-location/get-departamentos`
      );
      if (response.status === 200) {
        setDepartamentos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No hay municipios");
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSelectDepartamento = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(event.target.value);
    const selectedDep = departamentos.find((dep) => dep.id === id); // Buscar el departamento seleccionado
    setSelectedDepartamento(id);

    if (selectedDep) {
      handleFiltroChange("departamento", selectedDep.nombre); // Guardar el nombre en lugar del ID
    }

    try {
      const response = await axios.get(
        `${API_URL}/customer-location/get-municipios/${id}`
      );
      if (response.status === 200) {
        setMunicipios(response.data); // Actualizar municipios
      }
    } catch (error) {
      console.error("Error al obtener municipios", error);
      toast.error("No se pudieron cargar los municipios.");
    }
  };

  const handleSelectMunicipio = (value: string) => {
    handleFiltroChange("municipio", value);
  };

  useEffect(() => {
    getDepartamentos();
  }, []);

  const handleGenerarCliente = (prospectoId: number) => {
    // Aquí iría la lógica para generar un cliente a partir del prospecto
    console.log(`Generando cliente para el prospecto ${prospectoId}`);
  };

  const getProspectos = async () => {
    try {
      const response = await axios.get<Prospecto[]>(`${API_URL}/prospecto`);
      if (response.status === 200) {
        setProspectos2(response.data);
      }
    } catch (error) {
      console.error("Error fetching prospectos:", error);
    }
  };

  useEffect(() => {
    getProspectos();
  }, []);
  const prospectosFiltrados = prospectos2.filter((prospecto) => {
    return (
      prospecto.direccion
        .toLowerCase()
        .includes(filtros.direccion.toLowerCase()) &&
      (filtros.municipio === "" ||
        (prospecto.municipio &&
          prospecto.municipio.nombre === filtros.municipio)) &&
      (filtros.departamento === "" ||
        (prospecto.departamento &&
          prospecto.departamento.nombre === filtros.departamento)) &&
      (filtros.estado === "" || prospecto.estado === filtros.estado) &&
      (filtros.tipoCliente === "" ||
        prospecto.tipoCliente === filtros.tipoCliente)
    );
  });

  if (prospectos2.length <= 0) {
    return (
      <div>
        <h2 className="text-center text-xl font-bold">
          No hay prospectos disponibles
        </h2>
      </div>
    );
  }

  function calcularDiferenciaTiempo(inicio: Date, fin: Date) {
    // Verificar que las fechas sean válidas instancias de Date
    if (!(inicio instanceof Date) || !(fin instanceof Date)) {
      return "Tiempo no disponible";
    }

    // Calculamos la diferencia en milisegundos
    const diferenciaMs = fin.getTime() - inicio.getTime();

    if (diferenciaMs < 0) {
      return "Fecha de fin es anterior a la fecha de inicio";
    }

    // Convertimos la diferencia a horas, minutos y segundos
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

    // Formatear el resultado con manejo de plurales
    const formatoHoras = horas === 1 ? "hora" : "horas";
    const formatoMinutos = minutos === 1 ? "minuto" : "minutos";
    return `${horas} ${formatoHoras}, ${minutos} ${formatoMinutos}`;
  }

  console.log("Departamento seleccionado:", selectedDepartamento);
  console.log("Filtros actuales:", filtros);
  console.log("Prospectos filtrados:", prospectosFiltrados);

  //----------------------------------------

  // Función para cambiar el prospecto expandido
  const toggleProspect = (id: number): void => {
    setExpandedProspect(expandedProspect === id ? null : id);
  };

  // Función para renderizar la fila de detalles
  const renderDetailRow = (
    icon: ReactNode,
    label: string,
    value: string | number | null
  ) => (
    <div className="flex items-center space-x-2 py-1">
      {icon}
      <span className="font-medium">{label}:</span>
      <span>{value || "No especificado"}</span>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Registros de Prospectos</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Input
          placeholder="Filtrar por dirección"
          value={filtros.direccion}
          onChange={(e) => handleFiltroChange("direccion", e.target.value)}
        />
        <Select
          onValueChange={(value) =>
            handleSelectDepartamento({
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((departamento) => (
              <SelectItem
                key={departamento.id}
                value={departamento.id.toString()}
              >
                {departamento.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleSelectMunicipio}>
          <SelectTrigger>
            <SelectValue placeholder="Municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipios.map((municipio) => (
              <SelectItem key={municipio.id} value={municipio.nombre}>
                {municipio.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFiltroChange("tipoCliente", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mayorista">Mayorista</SelectItem>
            <SelectItem value="Minorista">Minorista</SelectItem>
            <SelectItem value="Boutique">Boutique</SelectItem>
            <SelectItem value="TiendaEnLinea">TiendaEnLinea</SelectItem>
            <SelectItem value="ClienteIndividual">ClienteIndividual</SelectItem>

            {/* Agrega más tipos de cliente según sea necesario */}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            setFiltros({
              direccion: "",
              municipio: "",
              departamento: "",
              estado: "",
              tipoCliente: "",
            })
          }
        >
          Limpiar filtro
        </Button>
      </div>

      {/* Lista de Prospectos */}
      <div className="space-y-4 shadow-xl">
        {prospectosFiltrados.map((prospecto) => (
          <Collapsible key={prospecto.id}>
            <div
              className="cursor-pointer border rounded-lg p-4"
              onClick={() => toggleProspect(prospecto.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Nombre del Prospecto */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </p>
                  <p>{prospecto.nombreCompleto || "No especificado"}</p>
                </div>

                {/* Empresa */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Empresa
                  </p>
                  <p>{prospecto.empresaTienda || "No especificado"}</p>
                </div>

                {/* Teléfono */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p>{prospecto.telefono || "No especificado"}</p>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Estado
                  </p>
                  <Badge
                    variant={
                      prospecto.estado === "Activo" ? "default" : "secondary"
                    }
                  >
                    {prospecto.estado}
                  </Badge>
                </div>
              </div>

              {/* Botón para expandir la información */}
              <div className="mt-2 flex justify-end">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="default">
                    {expandedProspect === prospecto.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent>
              <div className="p-4 bg-muted rounded-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Correo */}
                  {renderDetailRow(
                    <Mail className="h-4 w-4" />,
                    "Correo",
                    prospecto.correo
                  )}

                  {/* Dirección */}
                  {renderDetailRow(
                    <MapPin className="h-4 w-4" />,
                    "Dirección",
                    prospecto.direccion
                  )}

                  {/* Ubicación */}
                  {renderDetailRow(
                    <MapPin className="h-4 w-4" />,
                    "Ubicación",
                    `${prospecto.municipio.nombre}, ${prospecto.departamento.nombre}`
                  )}

                  {/* Tipo de Cliente */}
                  {renderDetailRow(
                    <User className="h-4 w-4" />,
                    "Tipo de cliente",
                    prospecto.tipoCliente
                  )}

                  {/* Volumen de Compra */}
                  {renderDetailRow(
                    <ShoppingCart className="h-4 w-4" />,
                    "Volumen de compra",
                    prospecto.volumenCompra
                  )}

                  {/* Presupuesto */}
                  {renderDetailRow(
                    <Coins className="h-4 w-4" />,
                    "Presupuesto",
                    prospecto.presupuestoMensual === "menos5000"
                      ? "Menos de Q5,000"
                      : prospecto.presupuestoMensual === "5000-10000"
                      ? "Q5,000 - Q10,000"
                      : prospecto.presupuestoMensual === "10001-20000"
                      ? "Q10,001 - Q20,000"
                      : prospecto.presupuestoMensual === "mas20000"
                      ? "Más de Q20,000"
                      : "Sin presupuesto"
                  )}

                  {/* Vendedor */}
                  {renderDetailRow(
                    <User className="h-4 w-4" />,
                    "Vendedor",
                    prospecto.vendedor.nombre
                  )}

                  {/* Duración */}
                  {renderDetailRow(
                    <Timer className="h-4 w-4" />,
                    "Duración",
                    prospecto.fin
                      ? calcularDiferenciaTiempo(
                          new Date(prospecto.inicio),
                          new Date(prospecto.fin)
                        )
                      : "En progreso..."
                  )}
                </div>

                {/* Notas */}
                <div>
                  <h3 className="font-semibold mb-2">Notas:</h3>
                  <p className="text-sm">
                    {prospecto.comentarios || "No hay notas"}
                  </p>
                </div>

                {/* Ubicación guardada */}
                {prospecto.ubicacion &&
                  prospecto.ubicacion.latitud &&
                  prospecto.ubicacion.longitud && (
                    <div className="flex items-center justify-start space-x-2">
                      <LocateIcon className="h-4 w-4" />
                      <a
                        className="text-primary hover:underline"
                        href={`https://www.google.com/maps/?q=${prospecto.ubicacion.latitud},${prospecto.ubicacion.longitud}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver ubicación guardada
                      </a>
                    </div>
                  )}

                {/* Botón para generar cliente */}
                <Button
                  onClick={() => handleGenerarCliente(prospecto.id)}
                  disabled={!prospecto.fin}
                  className="w-full"
                >
                  {prospecto.fin
                    ? "Generar Cliente"
                    : "Esperando reporte final"}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
