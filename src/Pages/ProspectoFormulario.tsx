import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { jwtDecode } from "jwt-decode";
import { UserToken } from "@/Utils/Types/UserTokenInfo";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
//-------------
// Interfaz para Prospecto
interface Prospecto {
  id: number;
  inicio: string; // Fecha en formato ISO
  fin: string | null; // Puede ser null si aún está activo
  usuarioId: number;
  clienteId: number | null; // Puede ser null si no está asociado a un cliente
  nombreCompleto: string;
  empresaTienda: string;
  telefono: string | null;
  correo: string | null;
  direccion: string;
  departamentoId: number; // Referencia al ID del departamento
  municipioId: number; // Referencia al ID del municipio
  estado: string; // Podría ser un enum para estados específicos
  preferenciaContacto: string | null;
  presupuestoMensual: number | null;
  volumenCompra: number | null;
  categoriasInteres: string[]; // O una interfaz para una categoría si tienes más detalles
  comentarios: string | null;
  creadoEn: string; // Fecha en formato ISO
  actualizadoEn: string; // Fecha en formato ISO
  departamento?: Departamento; // Opcional, si deseas incluir la relación
  municipio?: Municipio; // Opcional, si deseas incluir la relación
}

interface Departamento {
  id: number;
  nombre: string;
}

interface Municipio {
  id: number;
  nombre: string;
}
// Tipo para nuestro formulario
type FormData = {
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
  fin: string;
  //ubiccaciones
  departamentoId: number;
  municipioId: number;
  // latitud: ,
  // longitud: null,
  latitud?: number; // Aquí se define como number
  longitud?: number; // Aquí se define como number
};

const fechaHoraGuatemala = new Date().toLocaleString("es-GT", {
  timeZone: "America/Guatemala",
});

export default function ProspectoFormulario() {
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "",
    empresaTienda: "",
    telefono: "",
    correo: "",
    direccion: "",
    municipio: "",
    departamento: "",
    tipoCliente: "",
    categoriasInteres: [],
    volumenCompra: "",
    presupuestoMensual: "",
    preferenciaContacto: "",
    comentarios: "",
    fin: fechaHoraGuatemala,
    municipioId: 0,
    departamentoId: 0,
    //-----------------------
    latitud: 0,
    longitud: 0,
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitud: position.coords.latitude, // Esto será un número
            longitud: position.coords.longitude, // Esto será un número
          });
          toast.success("Ubicación obtenida exitosamente");
        },
        (error) => {
          console.log(error);
          toast.error("Error al obtener la ubicación");
        }
      );
      console.log("El form data con la latitud y lng es: ", formData);
    } else {
      toast.error("La geolocalización no es compatible con este navegador.");
    }
  };

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (categoria: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categoriasInteres: checked
        ? [...prev.categoriasInteres, categoria]
        : prev.categoriasInteres.filter((c) => c !== categoria),
    }));
  };

  // const validateForm = () => {
  //   const newErrors: Partial<FormData> = {};
  //   if (!formData.nombreCompleto)
  //     newErrors.nombreCompleto = "Este campo es requerido";
  //   if (!formData.telefono) newErrors.telefono = "Este campo es requerido";
  //   if (!formData.municipio) newErrors.municipio = "Este campo es requerido";
  //   if (!formData.departamento)
  //     newErrors.departamento = "Este campo es requerido";
  //   if (!formData.tipoCliente)
  //     newErrors.tipoCliente = "Este campo es requerido";
  //   if (
  //     formData.correoElectronico &&
  //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
  //       formData.correoElectronico
  //     )
  //   ) {
  //     newErrors.correoElectronico = "Dirección de correo inválida";
  //   }
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setIsSubmitting(true);
  //   setSubmitError(null);
  //   try {
  //     // Aquí iría la llamada real a tu API
  //     await axios.post("/api/prospectos", formData);
  //     setSubmitSuccess(true);
  //   } catch (error) {
  //     setSubmitError(
  //       "Hubo un error al enviar el formulario. Por favor, intente de nuevo."
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  //-------------------------------------------------
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");
  const [vendedor, setVendedor] = useState<UserToken | null>(null);

  useEffect(() => {
    if (token) {
      setVendedor(jwtDecode<UserToken>(token));
    }
  }, [token]);

  const [prospectoAbierto, setProspectoAbierto] = useState<Prospecto | null>(
    null
  );
  console.log("El ultimo prospecto abierto es: ", prospectoAbierto);

  const [prospectBoolean, setProspectBoolean] = useState(false);
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
      //   setError("No se pudo obtener el prospecto abierto.");
      return null; // Devuelve null si hay un error
    }
  }
  console.log("El last prospecto es: ", prospectoAbierto);

  // Cargar prospecto abierto
  useEffect(() => {
    const getLastProspecto = async () => {
      if (vendedor?.sub) {
        try {
          const lastProspecto: Prospecto | null = await fetchLastProspecto(
            vendedor.sub
          );
          if (lastProspecto) {
            setProspectoAbierto(lastProspecto);
            setFormData((prevFormData) => ({
              ...prevFormData,
              nombreCompleto: lastProspecto.nombreCompleto || "",
              empresaTienda: lastProspecto.empresaTienda || "",
              telefono: lastProspecto.telefono || "",
              correoElectronico: lastProspecto.correo || "",
              direccion: lastProspecto.direccion || "",
              municipioId: lastProspecto.municipioId || 0,
              departamentoId: lastProspecto.departamentoId || 0,
              municipio: lastProspecto.municipio?.nombre || "", // Asignar nombre del municipio
              departamento: lastProspecto.departamento?.nombre || "", // Asignar nombre del departamento
              fin: lastProspecto.fin || fechaHoraGuatemala, // Si aún no está cerrado
              // Rellena otros campos si es necesario
            }));
          } else {
            // Manejar caso en que no hay prospecto
            setFormData({
              nombreCompleto: "",
              empresaTienda: "",
              telefono: "",
              correo: "",
              direccion: "",
              municipio: "",
              departamento: "",
              tipoCliente: "",
              categoriasInteres: [],
              volumenCompra: "",
              presupuestoMensual: "",
              preferenciaContacto: "",
              comentarios: "",
              fin: fechaHoraGuatemala,
              municipioId: 0,
              departamentoId: 0,
            });
          }
        } catch (error) {
          console.error("Error al obtener el prospecto:", error);
          // Manejar error
        }
      }
    };

    if (vendedor?.sub) {
      getLastProspecto(); // Asegurarse que getLastProspecto funcione bien
    }
  }, [vendedor?.sub]);

  console.log(formData);

  const handleFinishProspect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.tipoCliente ||
      !formData.nombreCompleto ||
      !formData.empresaTienda ||
      !formData.direccion
    ) {
      toast.warning("Algunos campos son necesarios");
      return;
    }

    if (!formData.tipoCliente) {
      toast.warning("Especifique el tipo de cliente");
    }

    try {
      console.log("enviando.....");
      console.log({
        nombreCompleto: formData.nombreCompleto,
        empresaTienda: formData.empresaTienda,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        tipoCliente: formData.tipoCliente,
        categoriasInteres: formData.categoriasInteres,
        volumenCompra: formData.volumenCompra,
        presupuestoMensual: formData.presupuestoMensual,
        preferenciaContacto: formData.preferenciaContacto,
        comentarios: formData.comentarios,
        //
      });

      console.log("El id del prospecto abierto es: ", prospectoAbierto?.id);

      const response = await axios.patch(
        `${API_URL}/prospecto/actualizar-prospecto/${prospectoAbierto?.id}`,
        {
          nombreCompleto: formData.nombreCompleto,
          empresaTienda: formData.empresaTienda,
          telefono: formData.telefono,
          correo: formData.correo,
          tipoCliente: formData.tipoCliente,
          categoriasInteres: formData.categoriasInteres,
          volumenCompra: formData.volumenCompra,
          presupuestoMensual: formData.presupuestoMensual,
          preferenciaContacto: formData.preferenciaContacto,
          comentarios: formData.comentarios,
          fin: fechaHoraGuatemala,
          estado: "FINALIZADO",
          departamentoId: formData.departamentoId,
          municipioId: formData.municipioId,
          latitud: formData.latitud,
          longitud: formData.longitud,

          // latitud: formData.la
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Prospecto finalizado...");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar y finalizar prosecto");
    }
  };
  const postProspecto = async () => {
    // Validaciones mínimas
    if (!formData.nombreCompleto && !formData.empresaTienda) {
      toast.info(
        "Se necesita al menos un referente (nombre completo o empresa/tienda)"
      );
      return;
    }

    if (!formData.departamentoId || !formData.municipioId) {
      toast.info("Selecciona un departamento y municipio");
      return;
    }

    try {
      setIsSubmitting(true); // Evita múltiples envíos

      const response = await axios.post(`${API_URL}/prospecto`, {
        nombreCompleto: formData.nombreCompleto,
        empresaTienda: formData.empresaTienda,
        direccion: formData.direccion,
        departamentoId: formData.departamentoId, // Enviar el ID del departamento
        municipioId: formData.municipioId, // Enviar el ID del municipio
        usuarioId: vendedor?.sub, // Asegúrate de que vendedor?.sub esté definido
      });

      if (response.status === 201) {
        toast.info("Registro de prospecto iniciado");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setSubmitError(
        "Hubo un error al enviar el formulario. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  interface Departamento {
    nombre: string;
    id: number;
  }

  interface Municipio {
    nombre: string;
    id: number;
  }

  //-----------------LOGICA PARA SELECCIONAR UN DEPARTAMENTO Y SUS MUNICIPIOS-----------------------------
  const [departamentos2, setDepartamentos] = useState<Departamento[]>([]);
  // const [selectedDepartamento, setSelectedDepartamento] = useState<number>();
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customer-location/get-departamentos`
        ); // Ajusta la URL según tu API
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error fetching departamentos", error);
      }
    };

    fetchDepartamentos();
  }, []);

  // Lógica para seleccionar un departamento y sus municipios
  const handleSelectDepartamento = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(event.target.value);
    setFormData({
      ...formData,
      departamentoId: id,
      municipioId: 0,
      municipio: "",
    }); // Resetea municipio al seleccionar un departamento
    if (id) {
      const fetchMunicipios = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/customer-location/get-municipios/${id}`
          );
          const data = response.data;

          // Verifica que los datos recibidos sean un array antes de actualizarlos
          if (Array.isArray(data)) {
            setMunicipios(data);
          } else {
            setMunicipios([]); // Si no es un array, inicializa como array vacío
            console.error("Los datos recibidos no son un array:", data);
          }
        } catch (error) {
          console.error("Error fetching municipios", error);
        }
      };

      fetchMunicipios();
    }
  };

  const handleSelectMunicipio = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(event.target.value);
    const selectedMunicipio = municipios.find((m) => m.id === id); // Asegúrate de que la propiedad ID esté presente en tu objeto municipio
    if (selectedMunicipio) {
      setFormData({
        ...formData,
        municipioId: id,
        municipio: selectedMunicipio.nombre,
      });
    }
  };
  const [open, setOpen] = useState(false); // Estado para controlar el diálogo
  const openDialog = () => setOpen(true); // Abrir el diálogo
  // const []
  return (
    <div className="">
      {prospectBoolean ? (
        <div className="">
          <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle>Registro de Nuevo Prospecto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFinishProspect} className="space-y-6">
                {/* Información General */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Información General</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombreCompleto">Nombre Completo*</Label>
                      <Input
                        id="nombreCompleto"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleInputChange}
                      />
                      {errors.nombreCompleto && (
                        <p className="text-red-500 text-sm">
                          {errors.nombreCompleto}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="empresaTienda">
                        Empresa/Tienda (opcional)
                      </Label>
                      <Input
                        id="empresaTienda"
                        name="empresaTienda"
                        value={formData.empresaTienda}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono*</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-sm">
                          {errors.telefono}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="correo">Correo</Label>
                      <Input
                        id="correo"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleInputChange}
                      />
                      {errors.correo && (
                        <p className="text-red-500 text-sm">{errors.correo}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="municipio">Municipio/Pueblo*</Label>
                      <Input
                        id="municipio"
                        name="municipio"
                        value={formData.municipio}
                      />
                    </div>
                    <div>
                      <Label htmlFor="departamento">Departamento*</Label>
                      <Input
                        id="departamento"
                        name="municipio"
                        value={formData.departamento}
                      />
                    </div>
                  </div>
                </div>

                {/* Tipo de Cliente */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Tipo de Cliente*</h2>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("tipoCliente", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minorista">
                        Minorista (vende al consumidor final)
                      </SelectItem>
                      <SelectItem value="Mayorista">
                        Mayorista (compra en grandes volúmenes)
                      </SelectItem>
                      <SelectItem value="Boutique">
                        Boutique/Tienda Especializada
                      </SelectItem>
                      <SelectItem value="TiendaEnLinea">
                        Tienda en Línea
                      </SelectItem>
                      <SelectItem value="ClienteIndividual">
                        Cliente Individual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoCliente && (
                    <p className="text-red-500 text-sm">{errors.tipoCliente}</p>
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
                      "Ropa de Trabajo",
                      "Ropa de Marca",
                    ].map((categoria) => (
                      <div
                        key={categoria}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={categoria}
                          checked={formData.categoriasInteres.includes(
                            categoria
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(categoria, e.target.checked)
                          }
                          className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
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
                      handleSelectChange("volumenCompra", value)
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
                      handleSelectChange("presupuestoMensual", value)
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
                      handleSelectChange("preferenciaContacto", value)
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
                  <h2 className="text-xl font-semibold">Comentarios o Notas</h2>
                  <Textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    placeholder="Ingrese cualquier comentario adicional, nota o requisitos especiales"
                  />
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button type="button" onClick={handleGetLocation}>
                    Obtener ubicación actual
                  </Button>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Finalizar Prospecto"}
                  </Button>
                </div>

                {/* Mostrar las coordenadas obtenidas */}
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Nuevo Registro de Prospecto
              </CardTitle>
            </CardHeader>
            <form onSubmit={(e) => e.preventDefault()}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombreCompleto">Nombre Completo*</Label>
                  <Input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                  />
                  {errors.nombreCompleto && (
                    <p className="text-red-500 text-sm">
                      {errors.nombreCompleto}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="empresaTienda">
                    Empresa/Tienda (opcional)
                  </Label>
                  <Input
                    id="empresaTienda"
                    name="empresaTienda"
                    value={formData.empresaTienda}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="direccion">Dirección*</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                  {errors.direccion && (
                    <p className="text-red-500 text-sm">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="departamento">Departamento*</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectDepartamento({
                        target: { value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    value={String(formData.departamentoId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Departamentos</SelectLabel>
                        {departamentos2.map((departamento) => (
                          <SelectItem
                            key={departamento.id}
                            value={String(departamento.id)}
                          >
                            {departamento.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="municipio">Municipio*</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectMunicipio({
                        target: { value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    value={String(formData.municipioId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Municipios</SelectLabel>
                        {Array.isArray(municipios) &&
                          municipios.map((municipio) => (
                            <SelectItem
                              key={municipio.id}
                              value={String(municipio.id)}
                            >
                              {municipio.nombre}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" className="w-full" onClick={openDialog}>
                  Iniciar Prospecto
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Dialogo de confirmación */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Confirmar Registro de Prospecto
                </DialogTitle>
              </DialogHeader>
              <p className="text-center">
                ¿Está seguro de que desea iniciar este prospecto con la
                información ingresada?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await postProspecto();
                    setOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
