import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectM, { MultiValue } from "react-select"; // Importación correcta de react-select

import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL;
// Mock product data
// Tipos para Producto y Categoría
type Producto = {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precio: number;
  categorias: { categoria: { id: number; nombre: string } }[]; // Incluyo el ID de categoría
  stock: { cantidad: number };
};

// Estado para editar el producto
interface ProductoEdit {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  categoriaIds: number[]; // IDs de las categorías
  precio: number;
}

type Categoria = {
  id: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
};

export default function ViewProducts() {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [editedProduct, setEditedProduct] = useState<ProductoEdit>({
    nombre: "",
    id: 0,
    codigoProducto: "",
    descripcion: "",
    categoriaIds: [],
    precio: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "Todas",
    priceRange: [0, 300],
  });

  // Obtener productos desde el API
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product`);
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar productos");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Obtener categorías desde el API
  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/categories/simple-categories`
      );
      if (response.status === 200) {
        setCategoria(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Filtrar productos según filtros y búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.precio >= filters.priceRange[0] &&
      product.precio <= filters.priceRange[1] &&
      (filters.category === "Todas" ||
        product.categorias.some(
          (cat) => cat.categoria.nombre === filters.category
        ))
  );

  // Manejar cambios en el formulario de edición
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: name === "precio" ? Number(value) : value,
    });
  };

  // Función para mostrar el producto en modo de edición
  const handleEditProduct = (product: Producto) => {
    // setSelectedProduct(product);
    setEditedProduct({
      id: product.id,
      nombre: product.nombre,
      codigoProducto: product.codigoProducto,
      descripcion: product.descripcion,
      categoriaIds: product.categorias.map((cat) => cat.categoria.id),
      precio: product.precio,
    });
  };

  // Función para mostrar los detalles del producto
  const handleShowDetails = (product: Producto) => {
    setSelectedProduct(product);
  };

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/categories/simple-categories`
        );
        if (response.status === 200) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al pedir categorias");
      }
    };
    getCategories();
  }, []);

  console.log("El producto a actualizar es: ", editedProduct);
  const handleUpdateProducto = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/product/${editedProduct?.id}`,
        {
          nombre: editedProduct.nombre,
          categoriasIds: editedProduct.categoriaIds,
          codigoProducto: editedProduct.codigoProducto,
          descripcion: editedProduct.descripcion,
          precio: editedProduct.precio,
        }
      );

      if (response.status === 200 || response.status == 201) {
        toast.success("Producto actualizado correctamente");

        // Vuelve a cargar los productos después de actualizar
        await getProducts();

        // Limpia el producto seleccionado
        setEditedProduct({
          nombre: "",
          id: 0,
          codigoProducto: "",
          descripcion: "",
          categoriaIds: [],
          precio: 0,
        });
        setSelectedProduct(null); // Cierra el modal o panel de edición
      }
    } catch (error) {
      console.log(error);
      toast.warning("Error al actualizar producto");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Gestión de productos</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar producto por nombre..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <CardContent>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas</SelectItem>
                    {categoria &&
                      categoria.map((category) => (
                        <SelectItem value={category.nombre}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </div>
          </div>
          <div>
            <Label>Rango de Precio</Label>
            <Slider
              min={0}
              max={300}
              step={10}
              value={filters.priceRange}
              onValueChange={(value) =>
                setFilters({ ...filters, priceRange: value })
              }
              className="mt-2"
            />
            <div className="flex justify-between mt-2">
              <span>Q{filters.priceRange[0]}</span>
              <span>Q{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Renderizado de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.nombre}</h3>
                <p className="text-sm  mb-2">
                  Código: {product.codigoProducto}
                </p>
                <p className=" mb-2">
                  Precio Venta: Q{product.precio.toFixed(2)}
                </p>
                <div>
                  {product.categorias.map((prod, index) => (
                    <Badge key={index} className="mt-2">
                      {prod.categoria.nombre}
                    </Badge>
                  ))}
                </div>
                <Badge
                  variant={
                    product.stock && product.stock.cantidad > 0
                      ? "outline"
                      : "destructive"
                  }
                  className="mt-2"
                >
                  {product.stock && product.stock.cantidad > 0
                    ? `En Stock (${product.stock.cantidad})`
                    : "Fuera de Stock (0)"}
                </Badge>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowDetails(product)}
                >
                  Ver Detalles
                </Button>

                {/* Botón para abrir el dialog de edición */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleEditProduct(product)}
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Producto</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="flex flex-col">
                        <Label htmlFor="nombre">Producto Nombre</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={editedProduct.nombre || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="precio">Precio</Label>
                        <Input
                          id="precio"
                          name="precio"
                          type="number"
                          value={editedProduct.precio || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="codigoProducto">Producto Código</Label>
                        <Input
                          id="codigoProducto"
                          name="codigoProducto"
                          value={editedProduct.codigoProducto || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      {/* Dropdown de categorías con selección múltiple */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categorias" className="text-right">
                          Categoría
                        </Label>
                        <div className="col-span-3">
                          <SelectM
                            placeholder="Seleccionar..."
                            isMulti
                            name="categorias"
                            options={categorias.map((categoria) => ({
                              value: categoria.id,
                              label: categoria.nombre,
                            }))}
                            className="basic-multi-select text-black"
                            classNamePrefix="select"
                            onChange={(
                              selectedOptions: MultiValue<{
                                value: number;
                                label: string;
                              }>
                            ) => {
                              const selectedIds = selectedOptions.map(
                                (option) => option.value
                              );
                              setEditedProduct({
                                ...editedProduct,
                                categoriaIds: selectedIds,
                              });
                            }}
                            value={categorias
                              .filter((categoria) =>
                                editedProduct.categoriaIds.includes(
                                  categoria.id
                                )
                              )
                              .map((categoria) => ({
                                value: categoria.id,
                                label: categoria.nombre,
                              }))}
                          />
                        </div>
                      </div>
                    </form>
                    <DialogFooter className="space-x-2 mt-4">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProduct(null)}
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button onClick={handleUpdateProducto}>
                        Guardar Cambios
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>

      {/* Dialog para mostrar detalles del producto */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <>
              <h3 className="font-semibold text-lg">
                {selectedProduct.nombre}
              </h3>
              <p className="text-sm text-gray-500">
                Código: {selectedProduct.codigoProducto}
              </p>
              <p className="text-gray-600">
                Precio Venta: Q{selectedProduct.precio.toFixed(2)}
              </p>
              <p className="text-gray-600">
                Descripción: {selectedProduct.descripcion}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold">Categorías:</h4>
                {selectedProduct.categorias.map((cat, index) => (
                  <Badge key={index} className="mt-2">
                    {cat.categoria.nombre}
                  </Badge>
                ))}
              </div>
              <Badge
                variant={
                  selectedProduct.stock && selectedProduct.stock.cantidad > 0
                    ? "outline"
                    : "destructive"
                }
                className="mt-2"
              >
                {selectedProduct.stock && selectedProduct.stock.cantidad > 0
                  ? `En Stock (${selectedProduct.stock.cantidad})`
                  : "Fuera de Stock (0)"}
              </Badge>
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
