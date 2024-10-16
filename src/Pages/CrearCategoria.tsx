import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PencilIcon, TrashIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Category {
  id: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
}

export default function CrearCategoria() {
  const [categoria, setCategoria] = useState({
    nombre: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/categories`, categoria);
      if (response.status === 201) {
        toast.success("Categoría creada");
        setCategoria({ nombre: "" });
        getCategories(); // Refrescar lista de categorías
      }
    } catch (error) {
      toast.error("Error al crear categoría");
    }
  };

  const handleEditSubmit = async () => {
    if (!editingCategory) return;

    try {
      const response = await axios.patch(
        `${API_URL}/categories/${editingCategory.id}`,
        {
          nombre: categoria.nombre,
        }
      );
      if (response.status === 200) {
        toast.success("Categoría actualizada");
        getCategories(); // Refrescar lista de categorías
        closeModal();
      }
    } catch (error) {
      toast.error("Error al actualizar categoría");
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/categories/get-all-categories`
      );
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error("Error al cargar categorías");
    }
  };

  const openModal = (category: Category) => {
    setEditingCategory(category);
    setCategoria({ nombre: category.nombre });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoria({ nombre: "" });
    setEditingCategory(null);
  };

  const handleDelete = async () => {
    if (categoryToDelete === null) return;

    try {
      const response = await axios.delete(
        `${API_URL}/categories/${categoryToDelete}`
      );
      if (response.status === 200) {
        toast.success("Categoría eliminada");
        getCategories(); // Refrescar la lista
      }
    } catch (error) {
      toast.error("Error al eliminar categoría");
    } finally {
      closeConfirmDialog();
    }
  };

  const openConfirmDialog = (id: number) => {
    setCategoryToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setCategoryToDelete(null);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Crear Nueva Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Categoría</Label>
              <Input
                id="nombre"
                name="nombre"
                value={categoria.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: T-shirt"
              />
            </div>
            <Button type="submit" className="w-full">
              Crear Categoría
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Categorías</h2>
        <ul className="mt-4 space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md dark:bg-slate-900"
            >
              <span className="font-bold font-mono">{category.nombre}</span>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => openModal(category)}>
                  <PencilIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => openConfirmDialog(category.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para editar categoría */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre de la Categoría</Label>
                <Input
                  id="edit-nombre"
                  name="nombre"
                  value={categoria.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: T-shirt"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialogo de confirmación para eliminar */}
      {isConfirmDialogOpen && (
        <Dialog open={isConfirmDialogOpen} onOpenChange={closeConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Confirmar Eliminación
              </DialogTitle>
            </DialogHeader>
            <p className="text-center">
              ¿Estás seguro que quieres eliminar esta categoría? Será eliminada
              de todos los productos donde fue referenciada
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={closeConfirmDialog}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
