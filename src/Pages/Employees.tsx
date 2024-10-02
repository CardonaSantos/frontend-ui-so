import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Clock, User } from "lucide-react";
// import L from "leaflet";

// Asegúrate de importar los estilos de Leaflet
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/Context/SocketProvider ";
import MyLeafletMap from "../components/Map/Map";

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

// Datos de ejemplo (en una aplicación real, estos vendrían de una API)

export default function Employees() {
  const socket = useSocket();

  // const [employees, setEmployees] = useState(employeesData);
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

  console.log("Los empleados en vista empleados son: ", locations);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seguimiento de Empleados</h1>

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

      <Table>
        <TableCaption>Lista de empleados y su estado actual</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Ahora</TableHead>
            {/* <TableHead>Acciones</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc, index) => (
            <TableRow key={index}>
              <TableCell>{loc.usuario.nombre}</TableCell>

              <TableCell>
                <Badge
                  variant="default"
                  className={
                    "bg-green-500 text-white" // Para "Activo"
                  }
                >
                  Activo
                </Badge>
              </TableCell>
              <TableCell>
                <Clock className="w-4 h-4 inline mr-1" />
                {loc.usuario.asistencia?.entrada
                  ? new Date(loc.usuario.asistencia.entrada).toLocaleString()
                  : "Entrada no registrada"}
              </TableCell>
              <TableCell>
                <Clock className="w-4 h-4 inline mr-1" />
                {loc.usuario.asistencia?.salida
                  ? new Date(loc.usuario.asistencia.salida).toLocaleString()
                  : "En progreso"}
              </TableCell>

              <TableCell>
                <User className="w-4 h-4 inline mr-1" />
                {loc.usuario.prospecto?.nombreCompleto &&
                loc.usuario.prospecto?.empresaTienda
                  ? `${loc.usuario.prospecto.nombreCompleto} - ${loc.usuario.prospecto.empresaTienda}`
                  : "Sin actividad"}
              </TableCell>

              {/* <TableCell>
                {employee.currentAppointment ? (
                  <div>
                    <Badge variant="secondary">
                      <User className="w-4 h-4 mr-1" />
                      {employee.currentAppointment.client}
                    </Badge>
                    <br />
                    <Badge variant="outline" className="mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {employee.currentAppointment.startTime} -{" "}
                      {employee.currentAppointment.endTime || "En progreso"}
                    </Badge>
                  </div>
                ) : (
                  "Sin cita"
                )}
              </TableCell> */}
              {/* <TableCell>
                <Button variant="outline" size="sm">
                  Ver detalles
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// export default Employees
