import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {
  const [users, setUsers] = useState<UsersSystem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UsersSystem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UsersSystem | null>(null);
  const [isUserActive, setIsUserActive] = useState<boolean | null>(null);

  const [contrasenaActual, setContrasenaActual] = useState<string>("");

  const [editedUser, setEditedUser] = useState({
    nombre: "",
    correo: "",
    rol: "",
    contrasenaActualizar: "",
  }); // Formulario de edición

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No hay usuarios en este momento");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Maneja la edición del usuario
  // Maneja la edición del usuario
  const handleEditClick = (user: UsersSystem) => {
    setUserToEdit(user);
    setEditedUser({
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      contrasenaActualizar: "",
    });
    setIsUserActive(user.activo); // Aquí se guarda el estado activo
    setShowEditModal(true);
  };

  const handleDeleteClick = (user: UsersSystem) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/${userToDelete?.id}`
      );
      if (response.status === 200) {
        toast.success("Usuario eliminado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar usuario");
    }
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userToEdit?.id}`, {
        nombre: editedUser.nombre,
        correo: editedUser.correo,
        rol: editedUser.rol,
        // Solo envía la contraseña si existe una nueva
        contrasena: editedUser.contrasenaActualizar || undefined,
        contrasenaActual: contrasenaActual || undefined,
        activo: isUserActive,
      });
      console.log("La data enviada es:");

      console.log({
        nombre: editedUser.nombre,
        correo: editedUser.correo,
        contrasena: editedUser.contrasenaActualizar || "", // Nueva contraseña
        contrasenaActual: contrasenaActual, // Contraseña actual
        rol: editedUser.rol,
      });
      console.log("El id del usuari  a editar es:", userToEdit?.id);

      if (response.status === 200) {
        setShowEditModal(false);
        getUsers(); // Refrescar la lista de usuarios}
        setContrasenaActual("");
        toast.success("Usuario actualizado, cierre sesion e inicie de nuevo");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar usuario. Verifique las credenciales");
    }
  };

  console.log("El usuario a editar es: ", editedUser);
  console.log(
    "La contraseña actual del usuario a editar es: ",
    contrasenaActual
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Card className="mt-8 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de usuario</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.correo}</TableCell>
                    <TableCell>{user.rol}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        variant="default"
                        size="default"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="default"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-4">
            <h2 className="text-lg text-center">Confirmar eliminación</h2>
            <p className="text-center">
              ¿Estás seguro de que deseas eliminar a {userToDelete?.nombre}?
            </p>
            <p>
              Todos los registros del usuario relacionado podrían alterarse y
              generar huecos de información.
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="default" onClick={cancelDelete}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={confirmDelete}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded shadow-2xl p-6 max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <Input
                  value={editedUser.nombre}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, nombre: e.target.value })
                  }
                />
              </div>
              {/* Campo Correo */}
              <div>
                <label className="block text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input
                  value={editedUser.correo}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, correo: e.target.value })
                  }
                />
              </div>

              <h2>Cambiar contraseña</h2>
              <div>
                <label className="block text-sm font-medium">
                  Contraseña Actual
                </label>
                <Input
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Nueva contraseña
                </label>
                <Input
                  value={editedUser.contrasenaActualizar}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      contrasenaActualizar: e.target.value,
                    })
                  }
                />
              </div>
              {/* Campo Rol */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Rol</label>
                <Select
                  onValueChange={(value) =>
                    setEditedUser({ ...editedUser, rol: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={editedUser.rol || "Seleccionar Rol"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Campo Activo */}
              {/* Campo Activo */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Activo</label>
                <Select
                  value={isUserActive ? "true" : "false"} // Asignar el estado actual
                  onValueChange={(value) => setIsUserActive(value === "true")} // Actualizar el estado
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={isUserActive ? "Activo" : "Desactivado"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Desactivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Botones */}
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="default" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant={"outline"} onClick={handleSaveEdit}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

export interface User {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
  creadoEn: string;
  actualizadoEn: string;
  activo: boolean;
}

export type UsersSystem = User;
