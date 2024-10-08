import { useEffect, useState } from "react";
import { Coins, User2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MyLeafletMap from "../components/Map/Map";

import { useSocket } from "../Context/SocketProvider ";
const API_URL = import.meta.env.VITE_API_URL;

interface connectedUser {
  totalConnectedUsers: number;
  totalEmployees: number;
  totalAdmins: number;
}

interface ConnectedUsersData {
  totalConnectedUsers: number;
  totalEmployees: number;
  totalAdmins: number;
}

enum Rol {
  ADMIN = "ADMIN",
  VENDEDOR = "VENDEDOR",
}

enum Estado {
  EN_PROSPECTO = "EN_PROSPECTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

interface Asistencia {
  entrada: string; // fecha de entrada
  salida: string | null; // puede ser null si aún no ha salido
}

interface Prospecto {
  estado: Estado;
  inicio: string;
  nombreCompleto: string;
  empresaTienda: string;
}

interface Usuario {
  nombre: string;
  id: number;
  rol: Rol;
  prospecto: Prospecto | null; // Puede ser null
  asistencia: Asistencia | null; // Puede ser null
}

interface LocationReceived {
  latitud: number;
  longitud: number;
  usuarioId: number;
  usuario: Usuario;
  timestamp: string; // Timestamp de la ubicación
}

export default function Dashboard() {
  const socket = useSocket();
  const [connectedUsers, setConnectedUsers] = useState<connectedUser>();

  useEffect(() => {
    if (socket) {
      socket.emit("requestConnectedUsers");

      const updateListener = (data: ConnectedUsersData) => {
        console.log("Datos recibidos del WebSocket:", data);
        setConnectedUsers(data);
      };

      socket.on("updateConnectedUsers", updateListener);

      return () => {
        socket.off("updateConnectedUsers", updateListener);
      };
    }
  }, [socket]);

  console.log("Los usuarios conectados son: ", connectedUsers);
  console.log(connectedUsers?.totalConnectedUsers);

  console.log("--------------------------------------------------");

  const [locations, setLocations] = useState<LocationReceived[]>([]);

  useEffect(() => {
    if (socket) {
      const locationListener = (locationData: LocationReceived) => {
        console.log("Nueva ubicación recibida:", locationData);

        setLocations((prevLocations) => {
          const existingLocationIndex = prevLocations.findIndex(
            (loc) => loc.usuarioId === locationData.usuarioId
          );

          if (existingLocationIndex !== -1) {
            const updatedLocations = [...prevLocations];
            updatedLocations[existingLocationIndex] = locationData;
            return updatedLocations;
          } else {
            return [...prevLocations, locationData];
          }
        });
      };

      socket.on("receiveLocation", locationListener);

      return () => {
        socket.off("receiveLocation", locationListener);
      };
    }
  }, [socket]);

  //----------------------------------------------------------------------
  const [montoMes, setMontoMes] = useState(0);
  const [montoSemana, setMontoSemana] = useState(0);
  const [montoDia, setMontoDia] = useState(0);
  const [cantidadClientes, setCantidadClientes] = useState(0);

  const [loading, setLoading] = useState(true);
  console.log(loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mesResponse, semanaResponse, diaResponse, cantidadcustomers] =
          await Promise.all([
            fetch(`${API_URL}/analytics/get-total-month`),
            fetch(`${API_URL}/analytics/get-total-weekly`),
            fetch(`${API_URL}/analytics/get-total-day`),
            fetch(`${API_URL}/analytics/get-total-clientes`),
          ]);

        const montoMesData = await mesResponse.json();
        const montoSemanaData = await semanaResponse.json();
        const montoDiaData = await diaResponse.json();
        const cantidadClientes = await cantidadcustomers.json();

        setMontoMes(montoMesData);
        setMontoSemana(montoSemanaData);
        setMontoDia(montoDiaData);
        setCantidadClientes(cantidadClientes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center flex-1">
            <h1 className="text-2xl font-bold m-3 text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos del Mes
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Q
                {montoMes.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas de la semana
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Q
                {montoSemana.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas del día
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Q
                {montoDia.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Empleados activos
              </CardTitle>
              <User2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {connectedUsers
                  ? connectedUsers.totalConnectedUsers
                  : "No eres admin..."}
              </div>
            </CardContent>
          </Card>
          {/* 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Citas en curso
              </CardTitle>
              <User2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <User2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cantidadClientes ? cantidadClientes : "null"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discount Requests Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solicitudes de Descuento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descuento solicitado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Carlos Rodríguez</TableCell>
                  <TableCell>Empresa XYZ</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>Pendiente</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Aprobar
                    </Button>
                    <Button variant="outline" size="sm">
                      Rechazar
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Últimas ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Juan Pérez</TableCell>
                  <TableCell>Laptop</TableCell>
                  <TableCell>$999.99</TableCell>
                  <TableCell>2023-05-15</TableCell>
                  <TableCell>Completado</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ventas</TableHead>
                  {/* <TableHead>Profit</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Enero</TableCell>
                  <TableCell>Q10,000</TableCell>
                  <TableCell>100</TableCell>
                  {/* <TableCell>Q5,000</TableCell> */}
                </TableRow>
                <TableRow>
                  <TableCell>Febrero</TableCell>
                  <TableCell>Q12,000</TableCell>
                  <TableCell>120</TableCell>
                  {/* <TableCell>Q6,000</TableCell> */}
                </TableRow>
                <TableRow>
                  <TableCell>Marzo</TableCell>
                  <TableCell>Q15,000</TableCell>
                  <TableCell>150</TableCell>
                  {/* <TableCell>Q7,500</TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Employees Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Empleados Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
              {/* Placeholder for map */}
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <MyLeafletMap locations={locations} />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <nav className="flex space-x-4 mb-4 sm:mb-0">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Términos y condiciones
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Política de privacidad
            </a>
          </nav>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2024 Sistema V1. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
// export default Dashboard;
