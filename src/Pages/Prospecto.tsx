"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { Clientes } from "@/Utils/Types/Customers";
import { UserToken } from "@/Utils/Types/UserTokenInfo";
import { jwtDecode } from "jwt-decode";
import { Prospect } from "@/Utils/Types/Prospecto";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Interfaces
interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
}

interface SimpleClient {
  nombre: string;
}

interface Venta {
  id: number;
  monto: number;
  montoConDescuento: number;
  descuento: number | null;
  metodoPago: MetodoPago;
  timestamp: string;
  usuarioId: number;
  clienteId: number;
  citaId: number | null;
  prospectoId: number | null;
  cliente: SimpleClient;
}

enum MetodoPago {
  CONTADO,
  TARJETA,
  TRANSFERENCIA_BANCO,
}

export type SimpleSale = Venta[];

// Constantes
const API_URL = import.meta.env.VITE_API_URL;

export default function ProspectoComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleClientSelect = (clienteId: string) => {
    setSelectedClientId(clienteId);
  };

  const [prospecto, setProspecto] = useState<Prospect | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ventas, setVentas] = useState<SimpleSale>([]);
  const [customers, setCustomers] = useState<Clientes | null>(null);
  const [userToken, setUserToken] = useState<UserToken>();
  const [prospectExists, setProspectExists] = useState<boolean>(false);
  const [selectedVenta, setSelectedVentas] = useState<number>();
  const [reporte, setReporte] = useState<string>("");

  let tokenUser = localStorage.getItem("authToken");
  console.log("La venta es: ", ventas);

  useEffect(() => {
    if (tokenUser) {
      setUserToken(jwtDecode<UserToken>(tokenUser));
    }
  }, []);

  // Cargar clientes
  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers`);
        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.info("No hay clientes disponibles");
      }
    };
    getClients();
  }, []);

  // Cargar ventas
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await axios.get(`${API_URL}/sale/simple-sales`);
        if (response.status === 200) {
          setVentas(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.info("No hay ventas disponibles");
      }
    };
    getSales();
  }, []);

  // Verificar si hay un prospecto activo
  useEffect(() => {
    const checkActiveProspect = async () => {
      if (userToken) {
        try {
          const response = await axios.get(
            `${API_URL}/prospecto/last-prospect/${userToken.sub}`
          );
          if (response.status === 200 && response.data) {
            setProspecto(response.data);
            setProspectExists(true);
          }
        } catch (error) {
          console.log(error);
          toast.info("Error al verificar prospecto activo");
        }
      }
    };
    checkActiveProspect();
  }, [userToken]);

  const iniciarProspecto = async (clienteId: string) => {
    const inicioDate = new Date();
    const offset = -6 * 60; // Offset en minutos
    const inicioGuatemala = new Date(inicioDate.getTime() + offset * 60 * 1000)
      .toISOString()
      .replace("Z", "-06:00");

    try {
      const response = await axios.post(`${API_URL}/prospecto`, {
        inicio: inicioGuatemala,
        clienteId: parseInt(clienteId),
        usuarioId: userToken?.sub!,
      });

      if (response.status === 201) {
        toast.success("Prospecto iniciado");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const finalizarProspecto = async () => {
    const inicioDate = new Date();
    const offset = -6 * 60;
    const finalizarGuatemala = new Date(
      inicioDate.getTime() + offset * 60 * 1000
    )
      .toISOString()
      .replace("Z", "-06:00");

    try {
      const response = await axios.patch(
        `${API_URL}/prospecto/actualizar-prospecto/${prospecto?.id}`,
        {
          fin: finalizarGuatemala,
          ventaId: selectedVenta,
          prospectoId: prospecto?.id,
          reporte: reporte,
        }
      );

      if (response.status === 200) {
        toast.success("Prospecto finalizado");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al finalizar prospecto");
    }
  };

  // Interfaz de gestión de prospecto
  if (prospectExists && prospecto) {
    return (
      <div className="space-y-4 p-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Gestionar Prospecto</h2>
        <p>Cliente: {prospecto.cliente.nombre}</p>
        <p>Fecha de inicio: {new Date(prospecto.inicio).toLocaleString()}</p>

        {prospecto && (
          <>
            <Select
              onValueChange={(value) => setSelectedVentas(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Asociar venta" />
              </SelectTrigger>
              <SelectContent>
                {ventas
                  .sort((a, b) => {
                    const dateA = new Date(a.timestamp).getTime();
                    const dateB = new Date(b.timestamp).getTime();
                    return dateB - dateA; // Ordenar de más recientes a menos recientes
                  })
                  .map((venta) => (
                    <SelectItem key={venta.id} value={venta.id.toString()}>
                      {new Date(venta.timestamp).toLocaleString()}
                      {" - "}
                      {venta.cliente.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Agregar reporte o nota"
              value={reporte}
              onChange={(e) => setReporte(e.target.value)}
            />

            <Button onClick={finalizarProspecto}>Finalizar Prospecto</Button>
          </>
        )}
      </div>
    );
  }

  // Interfaz para iniciar un prospecto
  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Iniciar Prospecto</h2>
      <Select onValueChange={handleClientSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar cliente" />
        </SelectTrigger>
        <SelectContent>
          {customers?.map((cliente) => (
            <SelectItem key={cliente.id} value={cliente.id.toString()}>
              {cliente.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Iniciar Prospecto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirmar Prospecto</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas iniciar un nuevo prospecto?
          </DialogDescription>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (selectedClientId) {
                  iniciarProspecto(selectedClientId);
                }
                setIsDialogOpen(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
