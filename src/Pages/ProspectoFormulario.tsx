import { useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import { UserToken } from "@/Utils/Types/UserTokenInfo";
import { toast } from "sonner";
//-------------
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

// Tipo para nuestro formulario
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
  fin: string;
};

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

const fechaHoraGuatemala = new Date().toLocaleString("es-GT", {
  timeZone: "America/Guatemala",
});

export default function ProspectoFormulario() {
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "",
    empresaTienda: "",
    telefono: "",
    correoElectronico: "",
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
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.nombreCompleto)
      newErrors.nombreCompleto = "Este campo es requerido";
    if (!formData.telefono) newErrors.telefono = "Este campo es requerido";
    if (!formData.municipio) newErrors.municipio = "Este campo es requerido";
    if (!formData.departamento)
      newErrors.departamento = "Este campo es requerido";
    if (!formData.tipoCliente)
      newErrors.tipoCliente = "Este campo es requerido";
    if (
      formData.correoElectronico &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.correoElectronico
      )
    ) {
      newErrors.correoElectronico = "Dirección de correo inválida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Aquí iría la llamada real a tu API
      await axios.post("/api/prospectos", formData);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        "Hubo un error al enviar el formulario. Por favor, intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
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

  useEffect(() => {
    const getLastProspecto = async () => {
      if (vendedor?.sub) {
        try {
          const lastProspecto = await fetchLastProspecto(vendedor.sub);
          if (lastProspecto) {
            setProspectoAbierto(lastProspecto);
            // Actualiza los campos del formulario si existe un prospecto abierto
            setFormData((prevFormData) => ({
              ...prevFormData,
              nombreCompleto: lastProspecto.nombreCompleto || "",
              empresaTienda: lastProspecto.empresaTienda || "",
              telefono: lastProspecto.telefono || "",
              correoElectronico: lastProspecto.correo || "", // Correo correcto
              // Puedes seguir actualizando otros campos aquí si es necesario
            }));
            setProspectBoolean(true); // Solo marca como true si hay un prospecto abierto
          } else {
            // No hay un prospecto abierto
            setProspectoAbierto(null);
            setProspectBoolean(false);
          }
        } catch (error) {
          console.error("Error al obtener el prospecto:", error);
          // Manejo de errores, en caso de que falle la obtención del prospecto
          setProspectoAbierto(null);
          setProspectBoolean(false);
        }
      }
    };

    getLastProspecto();
  }, [vendedor?.sub]);

  console.log(formData);

  const handleFinishProspect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.tipoCliente) {
      toast.warning("Especifique el tipo de cliente");
    }

    try {
      const response = await axios.patch(
        `${API_URL}/prospecto/actualizar-prospecto/${prospectoAbierto?.id}`,
        {
          nombreCompleto: formData.nombreCompleto,
          empresaTienda: formData.empresaTienda,
          telefono: formData.telefono,
          correo: formData.correoElectronico,
          direccion: formData.direccion,
          municipio: formData.municipio,
          departamento: formData.departamento,
          tipoCliente: formData.tipoCliente,
          categoriasInteres: formData.categoriasInteres,
          volumenCompra: formData.volumenCompra,
          presupuestoMensual: formData.presupuestoMensual,
          preferenciaContacto: formData.preferenciaContacto,
          comentarios: formData.comentarios,
          //   fin: fechaHoraGuatemala,
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

  //ENVIAR LA PRIMER PARTE DEL PROSPECTO
  const postProspecto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/prospecto`, {
        nombreCompleto: formData.nombreCompleto,
        empresaTienda: formData.empresaTienda,
        telefono: formData.telefono,
        correo: formData.correoElectronico,
        usuarioId: vendedor?.sub,
      });
      if (response.status === 201) {
        toast.info("Registro de prospecto iniciado");
        setProspectBoolean(true);
        setSubmitSuccess(true);
        // window.location.reload();
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
      {prospectBoolean ? (
        <div className="">
          <Card className="w-full max-w-4xl mx-auto">
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
                      <Label htmlFor="correoElectronico">
                        Correo Electrónico
                      </Label>
                      <Input
                        id="correoElectronico"
                        name="correoElectronico"
                        type="email"
                        value={formData.correoElectronico}
                        onChange={handleInputChange}
                      />
                      {errors.correoElectronico && (
                        <p className="text-red-500 text-sm">
                          {errors.correoElectronico}
                        </p>
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
                      <Label htmlFor="municipio">
                        Ciudad/Pueblo/Municipio*
                      </Label>
                      <Input
                        id="municipio"
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleInputChange}
                      />
                      {errors.municipio && (
                        <p className="text-red-500 text-sm">
                          {errors.municipio}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="departamento">Departamento/Estado*</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("departamento", value)
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
                          {errors.departamento}
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
                    ].map((categoria) => (
                      <div
                        key={categoria}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={categoria}
                          checked={formData.categoriasInteres.includes(
                            categoria
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(categoria, checked as boolean)
                          }
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
                  <h2 className="text-xl font-semibold">
                    Comentarios o Necesidades Específicas
                  </h2>
                  <Textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    placeholder="Ingrese cualquier comentario adicional o requisitos especiales"
                  />
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* {submitSuccess && (
                  <Alert>
                    <AlertDescription>
                      El prospecto ha sido registrado exitosamente.
                    </AlertDescription>
                  </Alert>
                )} */}

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
                    <p className="text-red-500 text-sm">{errors.telefono}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="correoElectronico">Correo Electrónico</Label>
                  <Input
                    id="correoElectronico"
                    name="correoElectronico"
                    type="email"
                    value={formData.correoElectronico}
                    onChange={handleInputChange}
                  />
                  {errors.correoElectronico && (
                    <p className="text-red-500 text-sm">
                      {errors.correoElectronico}
                    </p>
                  )}
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
