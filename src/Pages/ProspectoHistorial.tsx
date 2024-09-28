"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  DollarSign,
  FileText,
  AlertCircle,
} from "lucide-react";

// Tipos
type Vendedor = {
  correo: string;
  id: number;
  nombre: string;
  rol: string;
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
  municipio: string;
  departamento: string;
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
};

// Datos de ejemplo
const datosEjemplo: Prospecto[] = [
  {
    id: 13,
    inicio: "2024-09-27T06:18:28.900Z",
    fin: "2024-09-27T21:45:06.000Z",
    usuarioId: 17,
    clienteId: null,
    nombreCompleto: "Mari Mileidy Camposeco Silvestre",
    empresaTienda: "Mary's Shop",
    telefono: "3245 3456",
    correo: "socoklocz@gmail.com",
    direccion: "Cantón Parroquia, Zona 2 Jacaltenango",
    municipio: "JACALTENANGO",
    departamento: "Huehuetenango",
    tipoCliente: "Mayorista",
    categoriasInteres: ["Ropa de Mujer", "Ropa de Hombre", "Ropa Infantil"],
    volumenCompra: "medio",
    presupuestoMensual: "5000-10000",
    preferenciaContacto: "whatsapp",
    comentarios:
      "El cliente busca ropa economica mayoritariament para mujeres y niños, ya que su tienda es una boutique, aveces compra ropa de hombres pero su publico es otro. Tambien revende paquetes de ropa",
    creadoEn: "2024-09-27T06:18:28.900Z",
    actualizadoEn: "2024-09-27T21:45:06.907Z",
    estado: "EN_PROSPECTO",
    vendedor: {
      correo: "sants117@gmail.com",
      id: 17,
      nombre: "Santos Miguel Cardona",
      rol: "ADMIN",
    },
  },
  // Agrega más registros de ejemplo aquí...
  {
    id: 14,
    inicio: "2024-09-27T06:18:28.900Z",
    fin: "2024-09-27T21:45:06.000Z",
    usuarioId: 17,
    clienteId: null,
    nombreCompleto: "Mari Mileidy Camposeco Silvestre",
    empresaTienda: "Mary's Shop",
    telefono: "3245 3456",
    correo: "socoklocz@gmail.com",
    direccion: "Cantón Parroquia, Zona 2 Jacaltenango",
    municipio: "JACALTENANGO",
    departamento: "Huehuetenango",
    tipoCliente: "Mayorista",
    categoriasInteres: ["Ropa de Mujer", "Ropa de Hombre", "Ropa Infantil"],
    volumenCompra: "medio",
    presupuestoMensual: "5000-10000",
    preferenciaContacto: "whatsapp",
    comentarios:
      "El cliente busca ropa economica mayoritariament para mujeres y niños, ya que su tienda es una boutique, aveces compra ropa de hombres pero su publico es otro. Tambien revende paquetes de ropa",
    creadoEn: "2024-09-27T06:18:28.900Z",
    actualizadoEn: "2024-09-27T21:45:06.907Z",
    estado: "EN_PROSPECTO",
    vendedor: {
      correo: "sants117@gmail.com",
      id: 17,
      nombre: "Santos Miguel Cardona",
      rol: "ADMIN",
    },
  },
];

// Lista de departamentos y municipios de Guatemala
const departamentos = [
  "Alta Verapaz",
  "Baja Verapaz",
  "Chimaltenango",
  "Chiquimula",
  "El Progreso",
  "Escuintla",
  "Guatemala",
  "Huehuetenango",
  "Izabal",
  "Jalapa",
  "Jutiapa",
  "Petén",
  "Quetzaltenango",
  "Quiché",
  "Retalhuleu",
  "Sacatepéquez",
  "San Marcos",
  "Santa Rosa",
  "Sololá",
  "Suchitepéquez",
  "Totonicapán",
  "Zacapa",
];

const municipios = [
  "Ciudad de Guatemala",
  "Mixco",
  "Villa Nueva",
  "Quetzaltenango",
  "Escuintla",
  "Chinautla",
  "Villa Canales",
  "San Miguel Petapa",
  "Huehuetenango",
  "Cobán",
  // Agrega más municipios aquí...
];

export default function ProspectoHistorial() {
  const [prospectos, setProspectos] = useState<Prospecto[]>(datosEjemplo);
  const [filtros, setFiltros] = useState({
    direccion: "",
    municipio: "",
    departamento: "",
    estado: "",
    tipoCliente: "",
  });

  useEffect(() => {
    // Aquí iría la lógica para cargar los datos reales de la API
    // Por ahora, usamos los datos de ejemplo
    setProspectos(datosEjemplo);
  }, []);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const prospectosFiltrados = prospectos.filter((prospecto) => {
    return (
      prospecto.direccion
        .toLowerCase()
        .includes(filtros.direccion.toLowerCase()) &&
      (filtros.municipio === "" || prospecto.municipio === filtros.municipio) &&
      (filtros.departamento === "" ||
        prospecto.departamento === filtros.departamento) &&
      (filtros.estado === "" || prospecto.estado === filtros.estado) &&
      (filtros.tipoCliente === "" ||
        prospecto.tipoCliente === filtros.tipoCliente)
    );
  });

  const handleGenerarCliente = (prospectoId: number) => {
    // Aquí iría la lógica para generar un cliente a partir del prospecto
    console.log(`Generando cliente para el prospecto ${prospectoId}`);
  };

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
          onValueChange={(value) => handleFiltroChange("municipio", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipios.map((municipio) => (
              <SelectItem key={municipio} value={municipio}>
                {municipio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleFiltroChange("departamento", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((departamento) => (
              <SelectItem key={departamento} value={departamento}>
                {departamento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFiltroChange("estado", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EN_PROSPECTO">En Prospecto</SelectItem>
            <SelectItem value="FINALIZADO">Finalizado</SelectItem>
            {/* Agrega más estados según sea necesario */}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleFiltroChange("tipoCliente", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo de cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mayorista">Mayorista</SelectItem>
            <SelectItem value="Minorista">Minorista</SelectItem>
            {/* Agrega más tipos de cliente según sea necesario */}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Prospectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {prospectosFiltrados.map((prospecto) => (
          <Card
            key={prospecto.id}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {prospecto.nombreCompleto}
              </h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Building className="mr-2" /> {prospecto.empresaTienda}
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2" /> {prospecto.telefono}
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2" /> {prospecto.correo}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2" /> {prospecto.direccion}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2" /> {prospecto.municipio},{" "}
                  {prospecto.departamento}
                </p>
                <p className="flex items-center">
                  <User className="mr-2" /> {prospecto.tipoCliente}
                </p>
                <p className="flex items-center">
                  <DollarSign className="mr-2" /> Volumen:{" "}
                  {prospecto.volumenCompra}
                </p>
                <p className="flex items-center">
                  <DollarSign className="mr-2" /> Presupuesto:{" "}
                  {prospecto.presupuestoMensual}
                </p>
                <p className="flex items-center">
                  <FileText className="mr-2" /> {prospecto.comentarios}
                </p>
                <p className="flex items-center">
                  <AlertCircle className="mr-2" /> Estado: {prospecto.estado}
                </p>
                <p className="flex items-center">
                  <User className="mr-2" /> Vendedor:{" "}
                  {prospecto.vendedor.nombre}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleGenerarCliente(prospecto.id)}
                className="w-full"
              >
                Generar Cliente
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
