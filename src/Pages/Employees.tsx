"use client";

import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Clock, MapPin, User, Calendar } from "lucide-react";
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
  ADMIN,
  VENDEDOR,
}
interface Usuario {
  nombre: string;
  id: number;
  rol: Rol;
}

interface locationReceived {
  latitud: number;
  longitud: number;
  usuarioId: number;
  usuario: Usuario;
}
// Datos de ejemplo (en una aplicación real, estos vendrían de una API)
const employeesData = [
  {
    id: 1,
    name: "Alberto Jesús",
    location: { lat: 15.6646, lng: -91.7121 },
    status: "active",
    checkIn: "08:30",
    checkOut: "",
    currentAppointment: {
      client: "Empresa XYZ",
      startTime: "09:30",
      endTime: "",
    },
  },
  {
    id: 2,
    name: "Mari Mileidy",
    location: { lat: 15.6684, lng: -91.7104 },
    status: "inactive",
    checkIn: "07:45",
    checkOut: "16:30",
    currentAppointment: null,
  },
  {
    id: 3,
    name: "Elizabeth R.",
    location: { lat: 15.6653, lng: -91.70697 },
    status: "active",
    checkIn: "09:00",
    checkOut: "",
    currentAppointment: {
      client: "Tienda Local",
      startTime: "10:30",
      endTime: "",
    },
  },
  {
    id: 4,
    name: "Fernanda M.",
    location: { lat: 15.6611, lng: -91.7052 },
    status: "inactive",
    checkIn: "08:15",
    checkOut: "17:00",
    currentAppointment: null,
  },
  {
    id: 5,
    name: "Carlos Ed.",
    location: { lat: 15.6532, lng: -91.7697 },
    status: "active",
    checkIn: "06:50",
    checkOut: "",
    currentAppointment: {
      client: "Restaurante La Paz",
      startTime: "09:00",
      endTime: "",
    },
  },
  {
    id: 6,
    name: "Faustina",
    location: { lat: 15.6549, lng: -91.7727 },
    status: "inactive",
    checkIn: "07:30",
    checkOut: "15:45",
    currentAppointment: null,
  },
];

export default function Employees() {
  const socket = useSocket();

  const [employees, setEmployees] = useState(employeesData);
  const [locations, setLocations] = useState<locationReceived[]>([]);

  useEffect(() => {
    if (socket) {
      const locationListener = (locationData: locationReceived) => {
        console.log("Nueva ubicación recibida:", locationData);

        setLocations((prevLocations) => {
          // Buscar si ya existe una ubicación para este usuario
          const existingLocationIndex = prevLocations.findIndex(
            (loc) => loc.usuarioId === locationData.usuarioId
          );

          if (existingLocationIndex !== -1) {
            // Si existe, actualizamos la ubicación
            const updatedLocations = [...prevLocations];
            updatedLocations[existingLocationIndex] = locationData;
            return updatedLocations;
          } else {
            // Si no existe, añadimos una nueva ubicación
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
            <TableHead>Cita Actual</TableHead>
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
                {loc.usuario.nombre}
              </TableCell>
              <TableCell>
                <Clock className="w-4 h-4 inline mr-1" />
                {/* {employee.checkOut || "En progreso"} */}
                {loc.usuario.nombre || "En progreso"}
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
