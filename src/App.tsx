import "./App.css";
import Login from "./components/Auth/Login";
// import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Layout from "./components/Layout/Layout"; // Asegúrate de que la ruta sea correcta
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import AdminDashboard from "./components/ComponentsMainDashboard/AdminDashboard";
// import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import CreateUser from "./components/Auth/CreateUser";
import { Toaster } from "sonner";
import Customers from "./Pages/Customers";
import Users from "./Pages/Users";
import Sales from "./Pages/Sales";
import Employees from "./Pages/Employees";
import SellerHistory from "./Pages/SellerHistory";
import CreateProduct from "./Pages/CreateProduct";
import StockPage from "./Pages/StockPage";
import ViewProducts from "./Pages/ViewProducts";
import MakeSale from "./Pages/MakeSale";
import HistorialVentas from "./Pages/SaleCard";
import CheckInCheckOut from "./Pages/CheckInCheckOut";
import CrearCategoria from "./Pages/CrearCategoria";
import CrearProveedor from "./Pages/CrearProveedor";
import StockDeliveryRecords from "./Pages/StockDeliveryRecords";
import CreateClient from "./Pages/CreateClient";
import Prospecto from "./Pages/Prospecto";
import ProspectoFormulario from "./Pages/ProspectoFormulario";
import ProspectoHistorial from "./Pages/ProspectoHistorial";
import ProspectoUbicacion from "./Pages/MapProspect/ProspectoUbicacion";
import PdfPage from "./components/PDF/PdfPage";
import DeliveryPdfPage from "./components/PDF/DeliveryPdfPage";
import EditCustomer from "./Pages/Tools/EditCustomer";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        {/* Notificaciones */}
        <Toaster position="top-right" duration={3000} />

        <Routes>
          {/* Redirecciona a dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Rutas no protegidas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateUser />} />

          {/* Rutas protegidas con Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comprobante-venta"
              element={
                <ProtectedRoute>
                  <PdfPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/empleados"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial-citas"
              element={
                <ProtectedRoute>
                  <ProspectoHistorial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial-empleados-check"
              element={
                <ProtectedRoute>
                  <SellerHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear-productos"
              element={
                <ProtectedRoute>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asignar-stock"
              element={
                <ProtectedRoute>
                  <StockPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ver-productos"
              element={
                <ProtectedRoute>
                  <ViewProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hacer-ventas"
              element={
                <ProtectedRoute>
                  <MakeSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial-ventas"
              element={
                <ProtectedRoute>
                  <HistorialVentas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registrar-entrada-salida"
              element={
                <ProtectedRoute>
                  <CheckInCheckOut />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear-categoria"
              element={
                <ProtectedRoute>
                  <CrearCategoria />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear-proveedor"
              element={
                <ProtectedRoute>
                  <CrearProveedor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear-cliente"
              element={
                <ProtectedRoute>
                  <CreateClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registro-entregas"
              element={
                <ProtectedRoute>
                  <StockDeliveryRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visita"
              element={
                <ProtectedRoute>
                  <Prospecto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prospecto"
              element={
                <ProtectedRoute>
                  <ProspectoFormulario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prospecto-ubicacion"
              element={
                <ProtectedRoute>
                  <ProspectoUbicacion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conseguir-comprobante-entrega"
              element={
                <ProtectedRoute>
                  <DeliveryPdfPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editar-cliente/:id"
              element={
                <ProtectedRoute>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

// ACTUALIZAR LA CREACION DE CLIENTES,
// Creacion de flujo de visita a cliente,
// Solucionar el error de prospectos historial mapa,
// Filtros,
// Check empleados historial, mejorar y filtros,
// Mejorar el card de venta, modelar el PDF, poner filtros,
// gestion de unstable_useViewTransitionState mejorar,
// clientes mejorar vista, filtros,
// dashboard, poner totales y otros
// notificacines,
//PROVEEDORES MEJORAR
// flujo de peticion de porcentajes

export default App;
