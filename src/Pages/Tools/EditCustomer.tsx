"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

export type UserToken = {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  iat: number;
  exp: number;
};

type FormData = {
  porcentaje: number;
};

export default function EditCustomer() {
  const [formData, setFormData] = useState<FormData>({
    porcentaje: 0,
  });

  const { id: clienteId } = useParams(); // Obtener el clienteId de la URL
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    // Decodificar el token del localStorage para obtener el usuarioId
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken: UserToken = jwtDecode(token);
      setUsuarioId(decodedToken.sub);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: parseFloat(value), // Asegurarse de convertir el valor a número
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que el clienteId y usuarioId están disponibles antes de enviar la solicitud
    if (!clienteId || !usuarioId) {
      toast.error(
        "No se ha encontrado la información necesaria para continuar."
      );
      return;
    }

    const data = {
      porcentaje: formData.porcentaje,
      //   usuarioId: usuarioId, // Este es el id del usuario (vendedor) obtenido del token
      clienteId: Number(clienteId), // Convertimos el id del cliente a número
    };

    try {
      const response = await axios.post(`${API_URL}/discount`, data);
      if (response.status === 201) {
        toast.success("Descuento añadido correctamente.");
        setFormData({ porcentaje: 0 }); // Reiniciar el formulario después de un envío exitoso
      }
    } catch (error) {
      toast.error("Error al añadir descuento.");
    }
  };

  return (
    <div className="">
      <div className="">
        <h2 className="text-center font-bold text-xl">Añadir Descuento</h2>
        <h2 className="text-center text-xl font-bold">En proceso...</h2>
      </div>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Ingrese los detalles del descuento para el cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 flex items-center">
              <Label htmlFor="porcentaje">Porcentaje de Descuento</Label>
              <Input
                id="porcentaje"
                name="porcentaje"
                value={formData.porcentaje}
                onChange={handleChange}
                placeholder="Ingrese el porcentaje de descuento"
                required
                type="number"
                min={0}
                max={100}
              />
              <p className="textcen font-bold m-2">%</p>
            </div>

            <Button type="submit" className="w-full">
              Añadir Descuento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
