import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { ProviderManage } from "@/Utils/Types2/ProviderManage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProveedoresList from "@/components/ProviderComponent/ProveedoresList";
import EditProveedorDialog from "@/components/ProviderComponent/EditProveedorDialog";
import DeleteConfirmDialog from "@/components/ProviderComponent/DeleteConfirmDialog";
const API_URL = import.meta.env.VITE_API_URL;

export default function CrearProveedor() {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    razonSocial: "",
    rfc: "",
    nombreContacto: "",
    telefonoContacto: "",
    emailContacto: "",
    pais: "",
    ciudad: "",
    codigoPostal: "",
    notas: "",
    latitud: 0,
    longitud: 0,
  });

  console.log(proveedor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/provider`, proveedor); // Envía el objeto directamente
      if (response.status === 201) {
        toast.success("Proveedor creado exitosamente");
        setProveedor({
          nombre: "",
          correo: "",
          telefono: "",
          direccion: "",
          razonSocial: "",
          rfc: "",
          nombreContacto: "",
          telefonoContacto: "",
          emailContacto: "",
          pais: "",
          ciudad: "",
          codigoPostal: "",
          latitud: 0,
          longitud: 0,
          notas: "",
        });
      }
    } catch (error) {
      toast.error("Error al crear el proveedor");
    }
    console.log("Proveedor a crear:", proveedor);
  };

  const handleCoordenadasCliente = (value: string) => {
    const [lat, lng] = value
      .split(",")
      .map((coord: string) => parseFloat(coord.trim()));

    setProveedor((prevData) => ({
      ...prevData,
      latitud: lat,
      longitud: lng,
    }));
  };

  const [providers, setProviders] = useState<ProviderManage[]>([]);
  // http://localhost:3000/provider
  useEffect(() => {
    const getProviders = async () => {
      try {
        const response = await axios.get(`${API_URL}/provider`);
        setProviders(response.data);
      } catch (error) {
        console.log(error);
        toast.info("No hay proveedores disponibles");
      }
    };
    getProviders();
  }, []);
  console.log("Mis proveedores son: ", providers);

  //----------------------------------
  const [proveedorActual, setProveedorActual] = useState<ProviderManage | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Función para abrir el diálogo de edición
  const handleEditProveedor = (proveedor: ProviderManage) => {
    setProveedorActual(proveedor);
    setIsEditDialogOpen(true);
    console.log("Editando proveedor");
  };

  // Función para abrir el diálogo de eliminación
  const handleDeleteProveedor = (proveedor: ProviderManage) => {
    setProveedorActual(proveedor);
    setIsDeleteDialogOpen(true);
    console.log("abriendo delete proveedor");
  };

  // Función para eliminar el proveedor (lógica de eliminación)
  const deleteProveedor = async (proveedorId: number) => {
    toast.success(`Proveedor a eliminar ${proveedorId}. Función en proceso...`);

    // try {
    //   const response = await axios.delete(
    //     `${API_URL}/provider/delete-provider/${proveedorId}`
    //   );
    //   if (response.status === 200) {
    //     toast.success("Proveedor eliminado");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Error al eliminar proveedor");
    // }
  };
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="proveedor" className="">
        <TabsList className="grid w-full max-w-2xl mx-auto shadow-md  grid-cols-2">
          <TabsTrigger value="proveedor">Crear Proveedor</TabsTrigger>
          <TabsTrigger value="password">Administrar</TabsTrigger>
        </TabsList>
        <TabsContent value="proveedor">
          <Card className="w-full max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Crear Nuevo Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={proveedor.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo</Label>
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      value={proveedor.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={proveedor.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={proveedor.direccion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razonSocial">Razón Social</Label>
                    <Input
                      id="razonSocial"
                      name="razonSocial"
                      value={proveedor.razonSocial}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input
                      id="rfc"
                      name="rfc"
                      value={proveedor.rfc}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreContacto">Nombre de Contacto</Label>
                    <Input
                      id="nombreContacto"
                      name="nombreContacto"
                      value={proveedor.nombreContacto}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefonoContacto">
                      Teléfono de Contacto
                    </Label>
                    <Input
                      id="telefonoContacto"
                      name="telefonoContacto"
                      type="tel"
                      value={proveedor.telefonoContacto}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailContacto">Email de Contacto</Label>
                    <Input
                      id="emailContacto"
                      name="emailContacto"
                      type="email"
                      value={proveedor.emailContacto}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      name="pais"
                      value={proveedor.pais}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      name="ciudad"
                      value={proveedor.ciudad}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      name="codigoPostal"
                      value={proveedor.codigoPostal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordenadas">Coordenadas (lat,long)</Label>
                    <Input
                      id="coordenadas"
                      name="coordenadas"
                      value={proveedor.latitud && proveedor.longitud}
                      onChange={(e) => handleCoordenadasCliente(e.target.value)}
                      placeholder="por ejemplo: 15.665394064189494, -91.71131300914816"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Input
                      id="notas"
                      name="notas"
                      value={proveedor.notas}
                      onChange={handleChange}
                      placeholder="Notas adicionales sobre el proveedor"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Crear Proveedor
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <div className="">
            <ProveedoresList
              proveedores={providers}
              onEdit={handleEditProveedor}
              onDelete={handleDeleteProveedor}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de edición */}
      {isEditDialogOpen && proveedorActual && (
        <EditProveedorDialog
          proveedor={proveedorActual}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      {isDeleteDialogOpen && proveedorActual && (
        <DeleteConfirmDialog
          proveedor={proveedorActual}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => deleteProveedor(proveedorActual.id)}
        />
      )}
    </div>
  );
}
