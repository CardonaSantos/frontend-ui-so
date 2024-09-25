import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
const API_URL = import.meta.env.VITE_API_URL;

// Tipos de datos de prueba
interface Product {
  id: number;
  productoId: number;
  entregaStockId: number;
  cantidad: number;
  costoUnitario: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    codigoProducto: string;
    creadoEn: string;
    actualizadoEn: string;
  };
}

interface Delivery {
  id: number;
  proveedorId: number;
  timestamp: string;
  creadoEn: string;
  actualizadoEn: string;
  total_pagado: number;
  productos: Product[];
  proveedor: {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    creadoEn: string;
    actualizadoEn: string;
  };
}

const StockDeliveryRecords: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const getDeliveryRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/delivery-stock`);
      if (response.status === 200) {
        setDeliveries(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("No se encontraron registros...");
    }
  };

  useEffect(() => {
    getDeliveryRecords();
  }, []);

  // Datos de prueba
  // const deliveries: Delivery[] = [
  //   {
  //     id: 12,
  //     proveedorId: 6,
  //     timestamp: "2024-09-25T05:12:57.293Z",
  //     creadoEn: "2024-09-25T05:12:57.293Z",
  //     actualizadoEn: "2024-09-25T05:12:57.293Z",
  //     total_pagado: 5960,
  //     productos: [
  //       {
  //         id: 21,
  //         productoId: 36,
  //         entregaStockId: 12,
  //         cantidad: 20,
  //         costoUnitario: 120,
  //         producto: {
  //           id: 36,
  //           nombre: "Tenis I-Runn",
  //           descripcion: "Tenis para montaña deportivo Rojo",
  //           precio: 240,
  //           codigoProducto: "L2K5NN",
  //           creadoEn: "2024-09-20T15:33:08.696Z",
  //           actualizadoEn: "2024-09-20T15:33:08.696Z",
  //         },
  //       },
  //       {
  //         id: 22,
  //         productoId: 40,
  //         entregaStockId: 12,
  //         cantidad: 20,
  //         costoUnitario: 55,
  //         producto: {
  //           id: 40,
  //           nombre: "CAMISA XL",
  //           descripcion: "Descripcion del producto",
  //           precio: 90,
  //           codigoProducto: "234FJ",
  //           creadoEn: "2024-09-21T16:05:48.422Z",
  //           actualizadoEn: "2024-09-21T16:05:48.422Z",
  //         },
  //       },
  //     ],
  //     proveedor: {
  //       id: 6,
  //       nombre: "Mi proveedor N°4",
  //       correo: "provedor4@gmail.com",
  //       telefono: "502 3567, 7642, 502 6543 8755",
  //       direccion: "Huehuetenango, Zona 2 Cantón Independecia",
  //       creadoEn: "2024-09-25T03:31:01.055Z",
  //       actualizadoEn: "2024-09-25T03:31:01.055Z",
  //     },
  //   },
  // ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Registro de Entregas de Stock
      </h1>
      {deliveries.map((delivery) => (
        <DeliveryCard key={delivery.id} delivery={delivery} />
      ))}
    </div>
  );
};

const DeliveryCard: React.FC<{ delivery: Delivery }> = ({ delivery }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Entrega #{delivery.id}</span>
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Proveedor</h3>
            <p>{delivery.proveedor.nombre}</p>
            <p>{delivery.proveedor.correo}</p>
            <p>{delivery.proveedor.telefono}</p>
          </div>
          <div>
            <h3 className="font-semibold">Detalles de la entrega</h3>
            <p>Fecha: {new Date(delivery.timestamp).toLocaleString()}</p>
            <p>Total pagado: Q{delivery.total_pagado.toFixed(2)}</p>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Productos entregados</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Costo Unitario</TableHead>
                    <TableHead>Total</TableHead>

                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delivery.productos.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.producto.nombre}</TableCell>
                      <TableCell>{product.cantidad}</TableCell>
                      <TableCell>Q{product.costoUnitario.toFixed(2)}</TableCell>
                      <TableCell>
                        Q{(product.costoUnitario * product.cantidad).toFixed(2)}
                      </TableCell>

                      <TableCell>{product.producto.codigoProducto}</TableCell>
                      <TableCell>{product.producto.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockDeliveryRecords;
