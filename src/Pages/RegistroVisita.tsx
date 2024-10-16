import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserToken } from "./Tools/EditCustomer";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, SortAsc } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
const API_URL = import.meta.env.VITE_API_URL;

enum MotivoVisita {
  COMPRA_CLIENTE = "COMPRA_CLIENTE",
  PRESENTACION_PRODUCTOS = "PRESENTACION_PRODUCTOS",
  NEGOCIACION_PRECIOS = "NEGOCIACION_PRECIOS",
  ENTREGA_MUESTRAS = "ENTREGA_MUESTRAS",
  PLANIFICACION_PEDIDOS = "PLANIFICACION_PEDIDOS",
  CONSULTA_CLIENTE = "CONSULTA_CLIENTE",
  SEGUIMIENTO = "SEGUIMIENTO",
  PROMOCION = "PROMOCION",
  OTRO = "OTRO",
}

enum TipoVisita {
  PRESENCIAL = "PRESENCIAL",
  VIRTUAL = "VIRTUAL",
}

enum EstadoVisita {
  INICIADA = "INICIADA",
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA",
}

interface Cliente {
  id: number;
  nombre: string;
  //   correo: string;
  //   telefono: string;
  //   direccion: string;
  //   creadoEn: string;
  //   actualizadoEn: string;
  //   descuentos: Descuento[];
}

type Visita = {
  id?: number;
  inicio: Date;
  fin?: Date;
  usuarioId: number | undefined;
  clienteId: number;
  observaciones?: string;
  motivoVisita?: MotivoVisita;
  tipoVisita?: TipoVisita;
  estadoVisita: EstadoVisita;
};

//--------------------------------------------
interface Cliente2 {
  correo: string;
  id: number;
  nombre: string;
  telefono: string;
}

interface Visita2 {
  id: number;
  inicio: string; // Usar string para las fechas en formato ISO
  fin: string | null;
  usuarioId: number;
  clienteId: number;
  observaciones: string | null;
  ventaId: number | null;
  motivoVisita: string; // Podrías tiparlo más estrictamente si tienes un enum para esto
  tipoVisita: string; // Podrías tiparlo más estrictamente si tienes un enum para esto
  estadoVisita: string; // Igual aquí, podrías usar un enum
  creadoEn: string; // Usar string para las fechas en formato ISO
  actualizadoEn: string; // Usar string para las fechas en formato ISO
  cliente: Cliente2;
}

export default function RegistroVisita() {
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [visitaActual, setVisitaActual] = useState<Visita | null>(null);

  const [registroAbierto, setRegistroAbierto] = useState<Visita2 | null>(null);

  const [nuevaVisita, setNuevaVisita] = useState<Omit<Visita, "id" | "inicio">>(
    {
      usuarioId: userToken?.sub,
      clienteId: 0,
      motivoVisita: undefined,
      tipoVisita: undefined,
      estadoVisita: EstadoVisita.INICIADA,
    }
  );
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<UserToken>(token);
        setUserToken(decodedToken);
      } catch (error) {
        console.error("Error decodificando el token:", error);
      }
    }
  }, []);

  // Simulación de datos de usuario y clientes

  const iniciarVisita = async () => {
    if (!nuevaVisita.clienteId) {
      toast.error("Debes seleccionar un cliente antes de iniciar la visita.");
      return;
    }

    try {
      // Asegurarte de que usuarioId esté correctamente configurado antes de enviar la solicitud
      const visitaConUsuarioId = {
        ...nuevaVisita,
        usuarioId: userToken?.sub,
        inicio: new Date(),
      };

      const response = await axios.post(
        `${API_URL}/date/start-new-visit`,
        visitaConUsuarioId
      );

      if (response.status === 201) {
        setVisitaActual(visitaConUsuarioId);
        toast.success("Registro de visita iniciado");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al iniciar registro");
    }
  };

  const finalizarVisita = async () => {
    if (visitaActual) {
      try {
        await axios.patch(
          `${API_URL}/date/update/visit-regist/${visitaActual.id}`,
          {
            fin: new Date(),
            // estadoVisita: EstadoVisita.FINALIZADA,
            observaciones,
          }
        );

        setVisitaActual({
          ...visitaActual,
          fin: new Date(),
          estadoVisita: EstadoVisita.FINALIZADA,
        });

        toast.success("Registro de visita finalizado");
        setTimeout(() => {
          setVisitaActual(null);
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
        toast.error("Error al finalizar la visita");
      }
    }
  };

  const cancelarVisita = async () => {
    if (visitaActual) {
      try {
        await axios.patch(
          `${API_URL}/date/cancel/visit-regist/${visitaActual.id}`,
          {
            fin: new Date(),
            estadoVisita: EstadoVisita.CANCELADA,
          }
        );

        setVisitaActual({
          ...visitaActual,
          fin: new Date(),
          estadoVisita: EstadoVisita.CANCELADA,
        });

        toast.success("Registro de visita cancelado");
        setTimeout(() => setVisitaActual(null), 2000);
        window.location.reload();
      } catch (error) {
        console.error(error);
        toast.error("Error al cancelar la visita");
      }
    }
  };

  //   const [registroAbierto, setRegistroAbierto] = useState<Visita | null>(null);

  useEffect(() => {
    const getRegistOpen = async () => {
      if (userToken) {
        try {
          const response = await axios.get(
            `${API_URL}/date/regist-open/${userToken.sub}`
          );

          if (response.status === 200) {
            setRegistroAbierto(response.data);
            setVisitaActual(response.data); // Asignamos directamente a visitaActual
          }
        } catch (error) {
          console.error("Error al obtener registro abierto:", error);
        }
      }
    };

    getRegistOpen();
  }, [userToken]);
  console.log("El registro abierto es: ", registroAbierto);

  //OTROS
  // Obtener clientes
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(
    null
  );
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customers/all-customers-with-discount`
        );
        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se encontraron clientes");
      }
    };

    getCustomers();
  }, []);

  console.log("La nueva visitar a crear es: ", nuevaVisita);
  const [observaciones, setObservaciones] = useState("");

  console.log("Las observaciones son: ", observaciones);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle>
          {visitaActual ? "Visita en Curso" : "Iniciar Nueva Visita"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registroAbierto ? (
          <div className="space-y-2">
            <p>
              Visita iniciada el:{" "}
              {new Date(registroAbierto.inicio).toLocaleString("es-GT", {
                timeZone: "America/Guatemala",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </p>
            <p>Cliente: {registroAbierto?.cliente.nombre}</p>
            <p className="">Telefono:{registroAbierto.cliente.telefono}</p>
            <p>Correo: {registroAbierto.cliente.correo}</p>

            <Textarea
              placeholder="Observaciones"
              value={observaciones || ""}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label
                htmlFor="cliente"
                className="block text-sm font-medium text-gray-700"
              >
                Cliente
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedCustomer
                      ? selectedCustomer.nombre
                      : "Seleccionar cliente..."}
                    <SortAsc className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar cliente..."
                      value={customerSearch}
                      onInput={(e) =>
                        setCustomerSearch((e.target as HTMLInputElement).value)
                      }
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontró el cliente.</CommandEmpty>
                      <CommandGroup>
                        {customers
                          .filter((customer) =>
                            customer.nombre
                              .toLowerCase()
                              .includes(customerSearch.toLowerCase())
                          )
                          .map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => {
                                setSelectedCustomer(customer);
                                setNuevaVisita({
                                  ...nuevaVisita,
                                  clienteId: customer.id,
                                }); // Asegúrate de actualizar el clienteId aquí
                                setOpen(false);
                              }}
                            >
                              {customer.nombre}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedCustomer?.id === customer.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label
                htmlFor="motivoVisita"
                className="block text-sm font-medium text-gray-700"
              >
                Motivo de la Visita
              </label>
              <Select
                onValueChange={(value) =>
                  setNuevaVisita({
                    ...nuevaVisita,
                    motivoVisita: value as MotivoVisita,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MotivoVisita).map((motivo) => (
                    <SelectItem key={motivo} value={motivo}>
                      {motivo.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="tipoVisita"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Visita
              </label>
              <Select
                onValueChange={(value) =>
                  setNuevaVisita({
                    ...nuevaVisita,
                    tipoVisita: value as TipoVisita,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoVisita).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {visitaActual ? (
          <>
            <Button onClick={finalizarVisita}>Finalizar Visita</Button>
            <Button variant="destructive" onClick={cancelarVisita}>
              Cancelar Visita
            </Button>
          </>
        ) : (
          <Button
            onClick={iniciarVisita}
            disabled={
              !nuevaVisita.clienteId ||
              !nuevaVisita.motivoVisita ||
              !nuevaVisita.tipoVisita
            }
          >
            Iniciar Visita
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
