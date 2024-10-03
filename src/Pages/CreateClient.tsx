import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const API_URL = import.meta.env.VITE_API_URL;

type FormData = {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  municipio: string;
  departamento: string;
  tipoCliente: string;
  categoriasInteres: string[];
  volumenCompra: string;
  presupuestoMensual: string;
  preferenciaContacto: string;
  comentarios: string;
  departamentoId: number;
  municipioId: number;
  latitud?: number; // Aquí se define como number
  longitud?: number; // Aquí se define como number
};

interface Departamento {
  nombre: string;
  id: number;
}

interface Municipio {
  nombre: string;
  id: number;
}

export default function CreateClient() {
  const [errors, setErrors] = useState<Partial<FormData>>({});
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState<string | null>(null);
  const [departamentos2, setDepartamentos] = useState<Departamento[]>([]);
  // const [selectedDepartamento, setSelectedDepartamento] = useState<number>();
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    municipio: "",
    departamento: "",
    tipoCliente: "",
    categoriasInteres: [],
    volumenCompra: "",
    presupuestoMensual: "",
    preferenciaContacto: "",
    comentarios: "",
    //ubiccaciones
    departamentoId: 0,
    municipioId: 0,
    // latitud: ,
    // longitud: null,
    latitud: 0, // Aquí se define como number
    longitud: 0, // Aquí se define como number
  });
  console.log("La data a enviar es: ", formData);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    try {
      const response = await axios.post(`${API_URL}/customers/`, {
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        direccion: formData.direccion,
        municipioId: formData.municipioId,
        departamentoId: formData.departamentoId,
        latitud: formData.latitud,
        longitud: formData.longitud,
        tipoCliente: formData.tipoCliente,
        categoriasInteres: formData.categoriasInteres,
        volumenCompra: formData.volumenCompra,
        presupuestoMensual: formData.presupuestoMensual,
        preferenciaContacto: formData.preferenciaContacto,
        comentarios: formData.comentarios,
      }); // Envía el objeto directamente
      if (response.status === 201) {
        toast.success("Cliente creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setFormData({
          nombre: "",
          correo: "",
          telefono: "",
          direccion: "",
          municipio: "", //No confundir con el ID
          departamento: "", //No confundir con el ID
          tipoCliente: "",
          categoriasInteres: [],
          volumenCompra: "",
          presupuestoMensual: "",
          preferenciaContacto: "",
          comentarios: "",
          departamentoId: 0,
          municipioId: 0,
          latitud: 0, // Aquí se define como number
          longitud: 0, // Aquí se define como number
        });
      }
    } catch (error) {
      toast.error("Error al crear cliente");
    }
  };

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

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCoordenadasCliente = (value: string) => {
    const [lat, lng] = value
      .split(",")
      .map((coord: string) => parseFloat(coord.trim()));

    setFormData((prevData) => ({
      ...prevData,
      latitud: lat,
      longitud: lng,
    }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Cliente</CardTitle>
        <CardDescription>
          Ingrese los detalles del nuevo cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Mari Mileidy Camposeco."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correo">Correo</Label>
            <Input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correoelectronico@gmail.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="502 3277 6558, 502 5555 0000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Jacaltenango, Cantón Pila Zona 2"
              required
            />
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
                <SelectItem value="TiendaEnLinea">Tienda en Línea</SelectItem>
                <SelectItem value="ClienteIndividual">
                  Cliente Individual
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoCliente && (
              <p className="text-red-500 text-sm">{errors.tipoCliente}</p>
            )}
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
                <SelectItem value="bajo">Bajo (1 - 50 unidades)</SelectItem>
                <SelectItem value="medio">Medio (51 - 200 unidades)</SelectItem>
                <SelectItem value="alto">Alto (201 - 500 unidades)</SelectItem>
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
                <SelectItem value="5000-10000">Q5,000 - Q10,000</SelectItem>
                <SelectItem value="10001-20000">Q10,001 - Q20,000</SelectItem>
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
          <h2 className="text-xl font-semibold">Añadir ubicación </h2>

          <div className="flex gap-2">
            <Input
              onChange={(e) => handleCoordenadasCliente(e.target.value)}
              placeholder="por ejemplo: 15.665394064189494, -91.71131300914816"
            />
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

          <Button type="submit" className="w-full">
            Crear Cliente
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
