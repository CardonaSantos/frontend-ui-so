import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  DollarSignIcon,
  MessageCircleIcon,
  BuildingIcon,
  UserIcon,
  ShoppingBag,
  LocateIcon,
  Container,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface Municipio {
  id: number;
  nombre: number;
  departamentoId: number;
}

export interface Departamento {
  id: number;
  nombre: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  municipioId: number;
  municipio: Municipio;
  departamentoId: number;
  departamento: Departamento;
  ubicacionId: number;
  tipoCliente: string;
  categoriasInteres: string[];
  volumenCompra: string;
  presupuestoMensual: string;
  preferenciaContacto: string;
  comentarios: string;
  ventas: any[]; // Puedes definir una interfaz más específica si es necesario
  ubicacion: Ubicacion;
}
const API_URL = import.meta.env.VITE_API_URL;

export default function ClientesList() {
  const [customers, setCustomers] = useState<Cliente[] | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<Cliente[] | null>(
    null
  );
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    departamentoId: "",
    municipioId: "",
    volumenCompra: "",
    presupuestoMensual: "",
  });

  async function getCustomers() {
    try {
      const response = await axios.get(
        `${API_URL}/customers/get-all-customers`
      );
      if (response.status === 200) {
        setCustomers(response.data);
        setFilteredCustomers(response.data); // Inicialmente, todos los clientes se muestran
      }
    } catch (error) {
      console.log(error);
      toast.info("No se encontraron clientes");
    }
  }

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customer-location/get-departamentos`
        );
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error fetching departamentos", error);
      }
    };

    fetchDepartamentos();
  }, []);

  // Maneja el filtro de departamentos
  const handleSelectDepartamento = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const departamentoId = Number(event.target.value);
    setFiltros((prev) => ({ ...prev, departamentoId: event.target.value }));

    if (departamentoId) {
      try {
        const response = await axios.get(
          `${API_URL}/customer-location/get-municipios/${departamentoId}`
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setMunicipios(data);
        } else {
          setMunicipios([]);
        }
      } catch (error) {
        console.error("Error fetching municipios", error);
      }
    }
  };

  // Maneja el filtro de municipios
  const handleSelectMunicipio = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFiltros((prev) => ({ ...prev, municipioId: event.target.value }));
  };

  // Maneja los otros filtros
  const handleFiltroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  // Aplicar filtros a los clientes
  useEffect(() => {
    if (customers) {
      const filtered = customers.filter((cliente) => {
        return (
          (filtros.nombre === "" ||
            cliente.nombre
              .toLowerCase()
              .includes(filtros.nombre.toLowerCase())) &&
          (filtros.departamentoId === "" ||
            cliente.departamentoId === Number(filtros.departamentoId)) &&
          (filtros.municipioId === "" ||
            cliente.municipioId === Number(filtros.municipioId)) &&
          (filtros.volumenCompra === "" ||
            cliente.volumenCompra === filtros.volumenCompra) &&
          (filtros.presupuestoMensual === "" ||
            cliente.presupuestoMensual === filtros.presupuestoMensual)
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [filtros, customers]);

  console.log("Los departamentos son: ", departamentos);
  console.log("los municipios son: ", municipios);
  console.log("Los datos filtrados son: ", filteredCustomers);

  const handleLimpiarFiltro = () => {
    setFiltros({
      nombre: "",
      departamentoId: "",
      municipioId: "",
      volumenCompra: "",
      presupuestoMensual: "",
    });
    setFilteredCustomers(customers);
    setMunicipios([]);
  };

  if (filteredCustomers && filteredCustomers?.length <= 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="w-full mb-2">
            <Input
              placeholder="Buscar por nombre"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
            />
          </div>

          <Select
            onValueChange={(value) =>
              handleFiltroChange({
                target: { name: "departamentoId", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos &&
                departamentos.map((depa) => (
                  <SelectItem value={String(depa.id)} key={depa.id}>
                    {depa.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleSelectMunicipio({
                target: { value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipios.map((municipio) => (
                <SelectItem key={municipio.id} value={String(municipio.id)}>
                  {municipio.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFiltroChange({
                target: { name: "volumenCompra", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Volumen de compra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bajo">Bajo (1 - 50 unidades)</SelectItem>
              <SelectItem value="medio">Medio (51 - 200 unidades)</SelectItem>
              <SelectItem value="alto">Alto (201 - 500 unidades)</SelectItem>
              <SelectItem value="muyAlto">
                Muy Alto (más de 500 unidades)
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFiltroChange({
                target: { name: "presupuestoMensual", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Presupuesto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos5000">Menos de Q5,000</SelectItem>
              <SelectItem value="5000-10000">Q5,000 - Q10,000</SelectItem>
              <SelectItem value="10001-20000">Q10,001 - Q20,000</SelectItem>
              <SelectItem value="mas20000">Más de Q20,000</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleLimpiarFiltro}>Limpiar filtro</Button>
        </div>
        <h2 className="text-xl font-bold text-center">
          No se encontraron clientes
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="w-full mb-2">
          <Input
            placeholder="Buscar por nombre"
            name="nombre"
            value={filtros.nombre}
            onChange={handleFiltroChange}
          />
        </div>

        <Select
          onValueChange={(value) =>
            handleSelectDepartamento({
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos &&
              departamentos.map((depa) => (
                <SelectItem value={String(depa.id)} key={depa.id}>
                  {depa.nombre}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleSelectMunicipio({
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipios.map((municipio) => (
              <SelectItem key={municipio.id} value={String(municipio.id)}>
                {municipio.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleFiltroChange({
              target: { name: "volumenCompra", value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Volumen de compra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bajo">Bajo (1 - 50 unidades)</SelectItem>
            <SelectItem value="medio">Medio (51 - 200 unidades)</SelectItem>
            <SelectItem value="alto">Alto (201 - 500 unidades)</SelectItem>
            <SelectItem value="muyAlto">
              Muy Alto (más de 500 unidades)
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleFiltroChange({
              target: { name: "presupuestoMensual", value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Presupuesto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="menos5000">Menos de Q5,000</SelectItem>
            <SelectItem value="5000-10000">Q5,000 - Q10,000</SelectItem>
            <SelectItem value="10001-20000">Q10,001 - Q20,000</SelectItem>
            <SelectItem value="mas20000">Más de Q20,000</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleLimpiarFiltro}>Limpiar filtro</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers &&
          filteredCustomers.map((cliente) => (
            <Card className="w-full max-w-md mx-auto overflow-hidden  hover:shadow-xl">
              <CardHeader className="bg-transparent">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold truncate">
                    {cliente.nombre}
                  </CardTitle>
                </div>
                <div className="">
                  <Badge variant="default" className="text-xs ">
                    {cliente.tipoCliente}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="flex items-center0">
                    <MailIcon className="mr-2 h-4 w-4" /> {cliente.correo}
                  </p>
                  <p className="flex items-center ">
                    <PhoneIcon className="mr-2 h-4 w-4" /> {cliente.telefono}
                  </p>
                  <p className="flex items-center ">
                    <MapPinIcon className="mr-2 h-4 w-4" /> {cliente.direccion}
                  </p>
                  <p className="flex items-center ">
                    <BuildingIcon className="mr-2 h-4 w-4" />{" "}
                    {cliente.municipio.nombre}, {cliente.departamento.nombre}
                  </p>
                </div>

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="details">
                    <AccordionTrigger className="bg-transparent h-5">
                      Ver más detalles
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 mt-2">
                        <p className="flex items-center ">
                          <CalendarIcon className="mr-2 h-4 w-4" /> Creado:{" "}
                          {new Date(cliente.creadoEn).toLocaleDateString()}
                        </p>
                        <p className="flex items-center ">
                          <DollarSignIcon className="mr-2 h-4 w-4" />{" "}
                          Presupuesto: {cliente.presupuestoMensual}
                        </p>
                        <p className="flex items-center ">
                          <MessageCircleIcon className="mr-2 h-4 w-4" />{" "}
                          Contacto: {cliente.preferenciaContacto}
                        </p>
                        <p className="flex items-center ">
                          <UserIcon className="mr-2 h-4 w-4" /> Volumen de
                          compra: {cliente.volumenCompra}
                        </p>

                        <p className="flex items-center ">
                          <ShoppingBag className="mr-2 h-4 w-4" /> Compras
                          hechas: {cliente.ventas.length}
                        </p>

                        <p className="flex items-center ">
                          <Container className="mr-2 h-4 w-4" /> Ver historial
                          de compras: Proximamente...
                        </p>

                        <p className="t">Comentarios: {cliente.comentarios}</p>
                        <div className="flex items-center justify-center">
                          {cliente.ubicacion.latitud &&
                          cliente.ubicacion.longitud ? (
                            <div className="flex items-center justify-center">
                              <LocateIcon className="m-2" />
                              <a
                                className="text-center font-bold"
                                href={`https://www.google.com/maps/?q=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`} // Esto añade un marcador
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Ver ubicación guardada
                              </a>
                            </div>
                          ) : (
                            <div>
                              <p className="flex items-center ">
                                No hay ubicaciones guardadas
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 flex justify-end">
                  <a href={`/editar-cliente/${cliente.id}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      Editar
                    </Button>
                  </a>

                  <Button variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
