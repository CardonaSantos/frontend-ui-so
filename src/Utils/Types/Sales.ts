export interface Venta {
  id: number;
  monto: number;
  metodoPago: MetodoPago;
  montoConDescuento: number;
  descuento: number;
  timestamp: string;
  usuarioId: number;
  clienteId: number;
  citaId: number | null;
  cliente: Cliente;
  productos: ProductoVenta[]; // Cambié a ProductoVenta
  vendedor: Vendedor; // Añadido el vendedor
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  ventas?: Venta[]; // Optional porque puede que no siempre incluyas las ventas
}

interface ProductoVenta {
  id: number;
  productoId: number;
  ventaId: number;
  cantidad: number;
  precio: number;
  creadoEn: string;
  producto: Producto;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface Vendedor {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  creadoEn: string;
  actualizadoEn: string;
}
export enum MetodoPago {
  CREDITO = "CREDITO",
  CONTADO = "CONTADO",
  TARJETA = "TARJETA",
  TRANSFERENCIA_BANCO = "TRANSFERENCIA_BANCO",
}

// export enum MetodoPago {
//   CONTADO,
//   TARJETA,
//   TRANSFERENCIA_BANCO,
//   CREDITO,
// }

export type SalesType = Venta[];
export type SaleTypeOne = Venta;
