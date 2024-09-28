"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserToken } from "@/Utils/Types/UserTokenInfo";
import { jwtDecode } from "jwt-decode";

// Tipos para nuestro formulario
type FormData = {
  nombreCompleto: string;
  empresaTienda: string;
  telefono: string;
  correoElectronico: string;
  direccion: string;
  municipio: string;
  departamento: string;
  tipoCliente: string;
  categoriasInteres: string[];
  volumenCompra: string;
  presupuestoMensual: string;
  preferenciaContacto: string;
  comentarios: string;
};

interface Prospecto {
  id: number;
  inicio: string; // Puedes usar Date si prefieres manejar fechas
  fin: string | null; // Puede ser una fecha o null
  usuarioId: number;

  nombreCompleto: string;
  empresaTienda: string;
  telefono: string | null;
  correo: string | null;

  creadoEn: string; // Puedes usar Date si prefieres manejar fechas
  actualizadoEn: string; // Puedes usar Date si prefieres manejar fechas
  estado: "EN_PROSPECTO" | string; // Puedes añadir otros estados si los conoces
}

// Lista de departamentos de Guatemala
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
const API_URL = import.meta.env.VITE_API_URL;

// Componente principal
export default function ProspectoForm() {
  const [vendedor, setVendedor] = useState<UserToken | null>(null);
  const [prospectoAbierto, setProspectoAbierto] = useState<Prospecto | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      setVendedor(jwtDecode<UserToken>(token));
    }
  }, [token]);

  async function fetchLastProspecto(vendedorId: number) {
    try {
      const response = await fetch(
        `${API_URL}/prospecto/abierto/${vendedorId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el prospecto");
      }
      const prospecto: Prospecto = await response.json();
      setProspectBoolean(true);
      return prospecto;
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo obtener el prospecto abierto.");
      return null; // Devuelve null si hay un error
    }
  }

  const [prospectBoolean, setProspectBoolean] = useState(false);
  useEffect(() => {
    const getLastProspecto = async () => {
      if (vendedor?.sub) {
        setLoading(true);
        const lastProspecto = await fetchLastProspecto(vendedor.sub);
        setProspectoAbierto(lastProspecto);
        // setProspectBoolean(true);
        setLoading(false);
      }
    };

    getLastProspecto();
  }, [vendedor?.sub]);

  console.log(prospectoAbierto);

  //------------------------------------------
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    empresaTienda: "",
    telefono: "",
    correoElectronico: "",
  });

  //--------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Aquí iría la llamada real a tu API
      await axios.post(`${API_URL}/prospecto`, data);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        "Hubo un error al enviar el formulario. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  //--------------------------------------------------------------------------
  const [formDataInicial, setFormDataInicial] = useState({
    nombreCliente: "",
    nombreTienda: "",
    telefono: "",
    correo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataInicial((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitInicial = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí puedes agregar la lógica para enviar los datos a tu backend
  };

  const postProspecto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aquí iría la llamada real a tu API
      const response = await axios.post(`${API_URL}/prospecto`, {
        // formDataInicial,
        nombreCompleto: formDataInicial.nombreCliente,
        empresaTienda: formDataInicial.nombreTienda,
        telefono: formDataInicial.telefono,
        correo: formDataInicial.correo,
        usuarioId: vendedor?.sub,
      });
      if (response.status === 200) {
        setProspectBoolean(true);
        setSubmitSuccess(true);
      }
    } catch (error) {
      setSubmitError(
        "Hubo un error al enviar el formulario. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      {loading && <p>Cargando...</p>}
      {/* {error && <p>{error}</p>} */}

      {prospectBoolean ? (
        <div>
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Registro de Nuevo Prospecto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información General */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Información General</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombreCompleto">Nombre Completo*</Label>
                      <Input
                        id="nombreCompleto"
                        {...register("nombreCompleto", {
                          required: "Este campo es requerido",
                        })}
                      />
                      {errors.nombreCompleto && (
                        <p className="text-red-500 text-sm">
                          {errors.nombreCompleto.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="empresaTienda">
                        Empresa/Tienda (opcional)
                      </Label>
                      <Input
                        id="empresaTienda"
                        {...register("empresaTienda")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono*</Label>
                      <Input
                        id="telefono"
                        {...register("telefono", {
                          required: "Este campo es requerido",
                        })}
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-sm">
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="correoElectronico">
                        Correo Electrónico
                      </Label>
                      <Input
                        id="correoElectronico"
                        type="email"
                        {...register("correoElectronico", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Dirección de correo inválida",
                          },
                        })}
                      />
                      {errors.correoElectronico && (
                        <p className="text-red-500 text-sm">
                          {errors.correoElectronico.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input id="direccion" {...register("direccion")} />
                    </div>
                    <div>
                      <Label htmlFor="municipio">
                        Ciudad/Pueblo/Municipio*
                      </Label>
                      <Input
                        id="municipio"
                        {...register("municipio", {
                          required: "Este campo es requerido",
                        })}
                      />
                      {errors.municipio && (
                        <p className="text-red-500 text-sm">
                          {errors.municipio.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departamento">Departamento/Estado*</Label>
                      <Select
                        onValueChange={(value) =>
                          register("departamento").onChange({
                            target: { value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {departamentos.map((dep) => (
                            <SelectItem key={dep} value={dep}>
                              {dep}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.departamento && (
                        <p className="text-red-500 text-sm">
                          {errors.departamento.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tipo de Cliente */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Tipo de Cliente*</h2>
                  <Select
                    onValueChange={(value) =>
                      register("tipoCliente").onChange({ target: { value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minorista">
                        Minorista (vende al consumidor final)
                      </SelectItem>
                      <SelectItem value="mayorista">
                        Mayorista (compra en grandes volúmenes)
                      </SelectItem>
                      <SelectItem value="boutique">
                        Boutique/Tienda Especializada
                      </SelectItem>
                      <SelectItem value="online">Tienda en Línea</SelectItem>
                      <SelectItem value="individual">
                        Cliente Individual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoCliente && (
                    <p className="text-red-500 text-sm">
                      {errors.tipoCliente.message}
                    </p>
                  )}
                </div>

                {/* Categorías de Interés */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Categorías de Interés
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "Ropa de Mujer",
                      "Ropa de Hombre",
                      "Ropa Infantil",
                      "Accesorios",
                      "Calzado",
                      "Ropa Deportiva",
                      "Ropa Formal",
                    ].map((categoria) => (
                      <div
                        key={categoria}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={categoria}
                          {...register("categoriasInteres")}
                          value={categoria}
                        />
                        <Label htmlFor={categoria}>{categoria}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volumen de Compra Estimado Mensual */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Volumen de Compra Estimado Mensual
                  </h2>
                  <Select
                    onValueChange={(value) =>
                      register("volumenCompra").onChange({ target: { value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el volumen de compra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bajo">
                        Bajo (1 - 50 unidades)
                      </SelectItem>
                      <SelectItem value="medio">
                        Medio (51 - 200 unidades)
                      </SelectItem>
                      <SelectItem value="alto">
                        Alto (201 - 500 unidades)
                      </SelectItem>
                      <SelectItem value="muyAlto">
                        Muy Alto (más de 500 unidades)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Presupuesto Mensual Aproximado */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Presupuesto Mensual Aproximado
                  </h2>
                  <Select
                    onValueChange={(value) =>
                      register("presupuestoMensual").onChange({
                        target: { value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el presupuesto mensual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menos5000">Menos de Q5,000</SelectItem>
                      <SelectItem value="5000-10000">
                        Q5,000 - Q10,000
                      </SelectItem>
                      <SelectItem value="10001-20000">
                        Q10,001 - Q20,000
                      </SelectItem>
                      <SelectItem value="mas20000">Más de Q20,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferencia de Comunicación */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Preferencia de Comunicación
                  </h2>
                  <Select
                    onValueChange={(value) =>
                      register("preferenciaContacto").onChange({
                        target: { value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la preferencia de contacto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Correo Electrónico</SelectItem>
                      <SelectItem value="telefono">Teléfono</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="visita">Visita en Persona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comentarios o Necesidades Específicas */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Comentarios o Necesidades Específicas
                  </h2>
                  <Textarea
                    {...register("comentarios")}
                    placeholder="Ingrese cualquier comentario adicional o requisitos especiales"
                  />
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {submitSuccess && (
                  <Alert>
                    <AlertDescription>
                      El prospecto ha sido registrado exitosamente.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Registrar Prospecto"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          {/* Muestra el formulario para registrar un nuevo prospecto aquí */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Nuevo Registro de Prospecto
              </CardTitle>
            </CardHeader>
            <form onSubmit={postProspecto}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreCliente">Nombre Cliente</Label>
                  <Input
                    id="nombreCliente"
                    name="nombreCliente"
                    value={formDataInicial.nombreCliente}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreTienda">
                    Nombre Tienda/Establecimiento
                  </Label>
                  <Input
                    id="nombreTienda"
                    name="nombreTienda"
                    value={formDataInicial.nombreTienda}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono (opcional)</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formDataInicial.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo (opcional)</Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={formDataInicial.correo}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Iniciar Prospecto
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
