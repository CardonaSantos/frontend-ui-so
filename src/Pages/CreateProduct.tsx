import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
// import { Proveedor } from "../Utils/Types/Proveedor";
import { Categorias } from "../Utils/Types/Category";

// const proveedoresIniciales = ["Proveedor A", "Proveedor B", "Proveedor C"];
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateProduct() {
  // const [providers, setProviders] = useState<Proveedor[]>([]);
  const [categories, setCategories] = useState<Categorias[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    codigoProducto: "",
    descripcion: "",
    categoriaIds: [] as number[],
    proveedor: "",
    precio: 0,
    precioVenta: 0,
  });

  let estadoInicial = {
    nombre: "",
    codigoProducto: "",
    descripcion: "",
    categoriaIds: [] as number[],
    proveedor: "",
    precio: 0,
    precioVenta: 0,
  };

  const handleClean = () => {
    setFormData(estadoInicial);
  };

  // const [showNewProveedorDialog, setShowNewProveedorDialog] = useState(false);
  // const [newProveedor, setNewProveedor] = useState("");
  // const [proveedores, setProveedores] = useState(proveedoresIniciales);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (categoryId: number) => {
    const isSelected = formData.categoriaIds.includes(categoryId);
    const newCategories = isSelected
      ? formData.categoriaIds.filter((id) => id !== categoryId)
      : [...formData.categoriaIds, categoryId];
    setFormData({ ...formData, categoriaIds: newCategories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.precio <= 0) {
      toast.warning("El precio no debe ser menor o igual a cero");
      return;
    }

    if (formData.categoriaIds.length <= 0) {
      toast.warning("El producto debe pertenecer a al menos una categoría");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/product`, formData);
      if (response.status === 201) {
        toast.success("Producto creado exitosamente");
        setFormData({
          nombre: "",
          codigoProducto: "",
          descripcion: "",
          categoriaIds: [] as number[],
          proveedor: "",
          precio: 0,
          precioVenta: 0,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal...");
    }
  };

  // const addNewProveedor = () => {
  //   if (newProveedor) {
  //     setProveedores([...proveedores, newProveedor]);
  //     setShowNewProveedorDialog(false);
  //     setNewProveedor("");
  //   }
  // };

  // const getProviders = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/provider`);
  //     if (response.status === 200) {
  //       setProviders(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.info("No se encontraron proveedores");
  //   }
  // };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se encontraron categorías");
    }
  };

  useEffect(() => {
    // getProviders();
    getCategories();
  }, []);

  const getCategoryNames = () => {
    return formData.categoriaIds
      .map((id) => categories.find((cat) => cat.id === id)?.nombre)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del producto</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="codigoProducto">Código del producto</Label>
            <Input
              id="codigoProducto"
              name="codigoProducto"
              value={formData.codigoProducto}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción del producto</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="categoriaIds">Añadir categorías</Label>
            <div className="categories-container">
              {categories.map((categoria) => (
                <div key={categoria.id} className="category-item">
                  <input
                    type="checkbox"
                    id={`cat-${categoria.id}`}
                    name="categoriaIds"
                    value={categoria.id}
                    checked={formData.categoriaIds.includes(categoria.id)}
                    onChange={() => handleCheckboxChange(categoria.id)}
                  />
                  <Label
                    htmlFor={`cat-${categoria.id}`}
                    className="category-label ml-2"
                  >
                    {categoria.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="precio">Precio de Venta</Label>
            <Input
              id="precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit">Crear producto</Button>
            <Button type="button" variant="outline" onClick={handleClean}>
              Limpiar
            </Button>
          </div>
        </form>

        <div className="mt-6 lg:mt-0">
          <h2 className="text-xl font-semibold mb-4">
            Vista Previa del Producto
          </h2>
          <div className="border p-4 rounded-md">
            <h3 className="font-bold">
              {formData.nombre || "Nombre del producto"}
            </h3>
            <p className="text-sm text-gray-500">
              <strong>Código:</strong> {formData.codigoProducto || "N/A"}
            </p>
            <p className="mt-2">
              <strong>Descripción del producto:</strong>{" "}
              {formData.descripcion || "N/A"}
            </p>
            <p className="mt-2">
              <strong>Categorías:</strong> {getCategoryNames() || "N/A"}
            </p>
            <p>
              <strong>Precio de venta:</strong> Q{formData.precio || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
