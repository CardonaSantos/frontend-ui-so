import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
// import { useTheme } from "next-themes";
import { CheckIcon, ShoppingCartIcon, SortAsc, XIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { CategoriaFiltrar } from "../Utils/Types/CategoyFilter";
import { jwtDecode } from "jwt-decode";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSocket } from "@/Context/SocketProvider ";
// import { Cliente, Descuento } from "../Utils/Types/CustomersWithDiscount";
const API_URL = import.meta.env.VITE_API_URL;

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  creadoEn: string;
  actualizadoEn: string;
  codigoProducto: string;
  stock: Stock | null;
  categorias: Category[];
}

interface Stock {
  id: number;
  productoId: number;
  cantidad: number;
  proveedorId: number;
  costo: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface Category {
  categoria: Categoria1;
  creadoEn: string;
}

interface Categoria1 {
  actualizadoEn: string;
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  descuentos: Descuento[];
}

interface Descuento {
  id: number;
  porcentaje: number;
  clienteId: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export default function MakeSale() {
  interface UserTokenInfo {
    nombre: string;
    correo: string;
    rol: string;
    sub: number;
  }

  interface Cliente2 {
    actualizadoEn: string;
    correo: string;
    creadoEn: string;
    descuentos: Descuento[];
    direccion: string;
    id: number;
    nombre: string;
    telefono: string;
  }

  interface Visita2 {
    actualizadoEn: string;
    cliente: Cliente2;
    clienteId: number;
    creadoEn: string;
    estadoVisita: string;
    fin: string | null;
    id: number;
    inicio: string;
    motivoVisita: string;
    observaciones: string | null;
    tipoVisita: string;
    usuarioId: number;
    ventaId: number | null;
  }

  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode<UserTokenInfo>(token);
        setTokenUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedMetodPago, setSelectedMetodPago] = useState("CONTADO");

  const [products, setProducts] = useState<Producto[]>([]);
  const [cart, setCart] = useState<(Producto & { quantity: number })[]>([]); // Agregamos `quantity` al estado del carrito
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(
    null
  );
  const [selectedDiscount, setSelectedDiscount] = useState<Descuento | null>(
    null
  );
  const [descuento, setDescuento] = useState<number>();
  const [nota, setNota] = useState<string>("");
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [categoria, setCategoria] = useState<CategoriaFiltrar[]>([]);

  const [showCartModal, setShowCartModal] = useState(false);
  const socket = useSocket();

  // Obtener productos
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product`);
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No hay productos disponibles");
      }
    };

    getProducts();
  }, []);

  ///===============================
  const getCustomers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/customers/all-customers-with-discount`
      );
      if (response.status === 200) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("No se encontraron clientes");
    }
  };

  // Obtener clientes
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/customers/all-customers-with-discount`
        );
        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se encontraron clientes");
      }
    };

    getCustomers();
  }, []);

  // Obtener clientes
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        if (response.status === 200) {
          setCategoria(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se encontraron clientes");
      }
    };

    getCategories();
  }, []);

  console.log(categoria);

  // Funciones de carrito
  const addToCart = (product: Producto) => {
    if (!product.stock || product.stock?.cantidad <= 0) {
      //si es null o no tiene suficiente
      toast.info("Stock insuficiente");
      return;
    }

    const productoExistente = cart.some((prod) => prod.id === product.id);

    if (productoExistente) {
      toast.info("El objeto ya está en el carrito");
      return;
    }

    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    toast.success("Añadido al Carrito");
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Eliminado del Carrito");
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) return; // Evitar cantidades negativas
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calcular total con descuento
  const calculateTotalConDescuento = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
    const discountPercentage = selectedDiscount
      ? selectedDiscount.porcentaje / 100
      : 0;
    return Number((subtotal * (1 - discountPercentage)).toFixed(2));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
    // const discountPercentage = selectedDiscount
    //   ? selectedDiscount.porcentaje / 100
    //   : 0;
    return subtotal;
  };

  // Filtrar productos
  const filteredProducts = products.filter(
    (product) =>
      (searchTerm === "" ||
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoProducto
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "Todas" ||
        product.categorias.some(
          (cat) => cat.categoria.nombre === selectedCategory
        ))
  );

  console.log(cart);

  const formatoCartData = (cart: (Producto & { quantity: number })[]) => {
    return {
      monto: cart.reduce(
        (total, item) => total + item.precio * item.quantity,
        0
      ), // Sumar el monto total
      montoConDescuento: calculateTotalConDescuento(),
      metodoPago: selectedMetodPago,
      descuento: selectedDiscount?.porcentaje, // Ajusta esto según tu lógica
      clienteId: selectedCustomer?.id, // Supongo que esto vendrá de algún lado, ajusta si es necesario
      vendedorId: tokenUser?.sub, // También ajusta según tu contexto
      productos: cart.map((item) => ({
        productoId: item.id, // Cambiar 'id' a 'productoId'
        cantidad: item.quantity, // La cantidad de productos
        precio: item.precio, // El precio del producto
      })),
    };
  };

  const clearCart = () => {
    setCart([]); // Asume que estás usando `setCart` para actualizar el carrito
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendCartData = async (cart: (Producto & { quantity: number })[]) => {
    const formateado = formatoCartData(cart);

    console.log("La data a enviar es: ", formateado);

    // Verifica que los campos requeridos estén completos
    if (
      !formateado.clienteId ||
      typeof formateado.monto === "undefined" ||
      !formateado.productos ||
      !formateado.vendedorId ||
      !formateado.montoConDescuento ||
      !formateado.metodoPago
    ) {
      toast.info("Faltan campos sin llenar");
      return;
    }

    try {
      setIsSubmitting(true); // Deshabilitar el botón
      console.log(formateado);
      const response = await axios.post(`${API_URL}/sale`, formateado);
      if (response.status === 200 || response.status === 201) {
        toast.success("Venta creada");
        clearCart();
        setIsSubmitting(false); // Habilitar el botón si la venta es exitosa
        setShowCartModal(false); // Opcional: cerrar el modal si la venta es exitosa
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear venta");
      setIsSubmitting(false); // Rehabilitar el botón si hay un error
    }
  };
  //----------------

  const [customerSearch, setCustomerSearch] = useState("");
  const [open, setOpen] = useState(false);

  console.log("El search es: ", customerSearch);

  //----------------------------------------
  const [registroAbierto, setRegistroAbierto] = useState<Visita2 | null>(null);

  useEffect(() => {
    const getRegistOpen = async () => {
      if (tokenUser) {
        try {
          const response = await axios.get(
            `${API_URL}/date/regist-open/${tokenUser.sub}`
          );

          if (response.status === 200) {
            const visitaData = response.data;

            // Actualiza el registro abierto
            setRegistroAbierto(visitaData);

            // Usa la data recibida directamente para actualizar el selectedCustomer
            setSelectedCustomer({
              id: visitaData?.cliente.id ?? 0, // Asegura que no sea undefined
              nombre: visitaData?.cliente.nombre ?? "", // Proporciona un valor por defecto si es undefined
              correo: visitaData?.cliente.correo ?? "",
              telefono: visitaData?.cliente.telefono ?? "",
              direccion: visitaData?.cliente.direccion ?? "",
              creadoEn: visitaData?.cliente.creadoEn ?? "",
              actualizadoEn: visitaData?.cliente.actualizadoEn ?? "",
              descuentos: visitaData?.cliente.descuentos ?? [], // Proporciona un arreglo vacío si es undefined
            });
          }
        } catch (error) {
          console.error("Error al obtener registro abierto:", error);
        }
      }
    };

    getRegistOpen();
  }, [tokenUser]);

  console.log("El registro abierto es: ", registroAbierto);
  console.log(
    "El id del cliente del registro vsita es: ",
    registroAbierto?.clienteId
  );

  async function realizarVentaConVisita(
    cart: (Producto & { quantity: number })[]
  ) {
    const formateado = formatoCartData(cart);

    console.log("La data a enviar es: ", formateado);

    // Verifica que los campos requeridos estén completos
    if (
      !formateado.clienteId ||
      typeof formateado.monto === "undefined" ||
      !formateado.productos ||
      !formateado.vendedorId ||
      !formateado.montoConDescuento ||
      !formateado.metodoPago
    ) {
      toast.info("Faltan campos sin llenar");
      return;
    }
    console.log("Los datos a enviar son:");

    console.log({
      formateado,
      registroVisitaId: registroAbierto?.id,
    });

    try {
      setIsSubmitting(true); // Deshabilitar el botón
      console.log(formateado);
      const response = await axios.post(`${API_URL}/sale/sale-for-regis`, {
        ...formateado,
        registroVisitaId: registroAbierto?.id,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Venta creada");
        clearCart();
        setIsSubmitting(false); // Habilitar el botón si la venta es exitosa
        setShowCartModal(false); // Opcional: cerrar el modal si la venta es exitosa
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear venta");
      setIsSubmitting(false); // Rehabilitar el botón si hay un error
    }
    console.log("La otra funcion nueva");
    console.log("El cart es: ", cart);
    console.log("El id de registro abierto es: ", registroAbierto?.id);
  }

  console.log("El usuario seleccionado es: ", selectedCustomer);

  //----------------------------------------------------------------

  const requestCustomDiscount = async () => {
    if (!selectedCustomer?.id || !tokenUser?.sub || !descuento) {
      toast.warning("Faltan datos para la solicitud");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/discount/request-discount`,
        {
          clienteId: selectedCustomer?.id, // ID del cliente
          justificacion: nota || "", // Justificación o motivo del descuento
          usuarioId: tokenUser?.sub, // ID del usuario/vendedor
          descuentoSolicitado: Number(descuento), // Porcentaje del descuento solicitado
          motivo: nota || "Sin motivo adicional", // Motivo adicional
        }
      );

      if (response.status == 200 || response.status == 201) {
        console.log("Solicitud enviada con éxito");
        toast.success("Solicitud enviada. Esperando respuesta...");
        setNota("");
        setDescuento(0);
      } else {
        console.error("Error al enviar la solicitud:", response.data.error);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      // Verifica si el rol es VENDEDOR
      // Escuchar el evento específico para vendedores
      socket.on("newNotificationToSeller", (newNotification) => {
        console.log(
          "La notificación entrante para vendedor es: ",
          newNotification
        );

        getCustomers();
      });

      // Limpiar el evento al desmontar el componente
      return () => {
        socket.off("newNotificationToSeller"); // Limpiar el evento específico para vendedores
      };
    }
  }, [socket, tokenUser]); // Añadir tokenUser como dependencia para actualizar si cambia

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Selección de Cliente y Descuento */}
      <div className="lg:col-span-2">
        <Card className="mb-8 shadow-xl">
          <CardContent>
            <h3 className="text-md font-semibold mb-4 pt-2">
              Selección de Cliente
            </h3>
            <Popover
              open={!!registroAbierto ? false : open} // No permitimos que se abra si hay registro abierto
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                  disabled={!!registroAbierto} // Aquí sí puedes usar "disabled" en el botón
                >
                  {registroAbierto
                    ? registroAbierto.cliente.nombre // Si hay un registro abierto, mostrar el cliente de la visita
                    : selectedCustomer
                    ? selectedCustomer.nombre
                    : "Seleccionar cliente..."}
                  <SortAsc className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              {/* Solo renderizamos el contenido del Popover si no hay un registro abierto */}
              {!registroAbierto && (
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar cliente..."
                      value={customerSearch}
                      onInput={(e) =>
                        setCustomerSearch((e.target as HTMLInputElement).value)
                      }
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontró el cliente.</CommandEmpty>
                      <CommandGroup>
                        {customers
                          .filter((customer) =>
                            customer.nombre
                              .toLowerCase()
                              .includes(customerSearch.toLowerCase())
                          )
                          .map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.id.toString()}
                              onSelect={() => {
                                setSelectedCustomer(customer);
                                setOpen(false);
                              }}
                            >
                              {customer.nombre}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedCustomer?.id === customer.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>

            {selectedCustomer && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Descuentos disponibles:</h3>
                <Select
                  value={selectedDiscount?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const discount = selectedCustomer.descuentos.find(
                      (d) => d.id === parseInt(value)
                    );
                    setSelectedDiscount(discount || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar descuento" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCustomer?.descuentos.length > 0 ? (
                      selectedCustomer.descuentos.map((discount) => (
                        <SelectItem
                          key={discount.id}
                          value={discount.id.toString()}
                        >
                          {discount.porcentaje}%
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="0">
                        No hay descuentos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solicitar Descuento Personalizado */}
        <Card className="mb-1 shadow-xl">
          <CardContent>
            <h3 className="text-md font-semibold mb-4 pt-2">
              Solicitar Descuento
            </h3>
            <div className="flex items-center mb-4">
              <input
                className="bg-white dark:text-black border rounded-md p-2 w-32 mr-2"
                type="number"
                placeholder="Porcentaje"
                min="0"
                max="100"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
              />
              <span className="text-lg">%</span>
            </div>
            <Textarea
              placeholder="Justificación"
              onChange={(e) => setNota(e.target.value)}
              className="mb-4"
              value={nota}
            />
            <Button
              type="button"
              // disabled={isRequesting}
              onClick={requestCustomDiscount}
              className="mt-2"
            >
              Solicitar Descuento Personalizado
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Método de Pago y Carrito */}
      <div className="lg:col-span-1">
        <Card className="mb-1 shadow-xl">
          <CardContent>
            <h3 className="text-md font-semibold mb-4 pt-2">Método de Pago</h3>
            <Select
              value={selectedMetodPago}
              onValueChange={setSelectedMetodPago}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="CONTADO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTADO">CONTADO</SelectItem>
                <SelectItem value="TARJETA">TARJETA</SelectItem>
                <SelectItem value="TRANSFERENCIA_BANCO">
                  TRANSFERENCIA BANCARIA
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowCartModal(true)}
              className="mt-4"
            >
              <ShoppingCartIcon className="mr-2" />
              Ver Carrito ({cart.length})
            </Button>

            <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Carrito de Compras</DialogTitle>
                  <DialogDescription>
                    Estos son los productos que has añadido al carrito.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[300px]">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                      El carrito está vacío
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between mb-4"
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{item.nombre}</p>
                          <p>=</p>
                          <p className="text-sm text-muted-foreground">
                            Q{item.precio.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="1"
                            max={item.stock?.cantidad}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16 mr-2"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
                <DialogFooter className="flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="font-semibold">Total: Q{calculateTotal()}</p>
                    <p className="font-semibold">
                      Total con descuento: Q{calculateTotalConDescuento()}
                    </p>
                    <p className="font-semibold">
                      Descuento:{" "}
                      {selectedDiscount
                        ? `${selectedDiscount.porcentaje}%`
                        : "Descuento no seleccionado"}
                    </p>
                    <p className="font-semibold">
                      Cliente:{" "}
                      {registroAbierto
                        ? registroAbierto.cliente.nombre
                        : selectedCustomer?.nombre}
                    </p>
                    <p className="font-semibold">
                      Método de pago: {selectedMetodPago}
                    </p>
                  </div>
                  <div className="flex gap-2 pb-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (registroAbierto) {
                          // Función para venta con visita abierta
                          realizarVentaConVisita(cart);
                        } else {
                          // Función convencional
                          sendCartData(cart);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Confirmar venta"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowCartModal(false)}
                    >
                      Cerrar
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Productos Filtrados */}
      <div className="lg:col-span-3">
        <Card className="mb-4 shadow-xl">
          <CardContent>
            <div className="pt-5 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              {/* Input de búsqueda más largo */}
              <Input
                type="text"
                placeholder="Buscar productos por nombre o código"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow md:flex-grow-0 md:w-3/4" // Aumenta el ancho del Input en pantallas más grandes
              />

              {/* Select con ancho ajustado */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {categoria?.map((category) => (
                    <SelectItem key={category.nombre} value={category.nombre}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[500px] shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{product.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.codigoProducto}
                  </p>
                  <div className="flex flex-wrap gap-2 my-2">
                    {product.categorias.map((cat) => (
                      <Badge key={cat.categoria.id} variant="outline">
                        {cat.categoria.nombre}
                      </Badge>
                    ))}
                  </div>
                  <p className="font-semibold mt-2">
                    Q{product.precio.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Stock:{" "}
                    {product.stock &&
                    product.stock.cantidad &&
                    product.stock.cantidad > 0 ? (
                      <Badge variant="outline">{product.stock.cantidad}</Badge>
                    ) : (
                      <Badge variant="destructive">Fuera de stock</Badge>
                    )}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock?.cantidad === 0}
                  >
                    Añadir al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
