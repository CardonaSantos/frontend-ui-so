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
import DatesView from "./Pages/DatesView";
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
import ProspectoForm from "./Pages/ProspectoForm";
import ProspectoFormulario from "./Pages/ProspectoFormulario";
import ProspectoHistorial from "./Pages/ProspectoHistorial";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/ventas" element={<Sales />} />
            <Route path="/empleados" element={<Employees />} />
            <Route path="/historial-citas" element={<DatesView />} />
            <Route
              path="/historial-empleados-check"
              element={<SellerHistory />}
            />
            <Route path="/crear-productos" element={<CreateProduct />} />
            <Route path="/asignar-stock" element={<StockPage />} />
            <Route path="/ver-productos" element={<ViewProducts />} />
            <Route path="/hacer-ventas" element={<MakeSale />} />
            <Route path="/historial-ventas" element={<HistorialVentas />} />
            <Route
              path="/registrar-entrada-salida"
              element={<CheckInCheckOut />}
            />

            <Route path="/crear-categoria" element={<CrearCategoria />} />
            <Route path="/crear-proveedor" element={<CrearProveedor />} />
            <Route path="/crear-cliente" element={<CreateClient />} />

            <Route
              path="/registro-entregas"
              element={<StockDeliveryRecords />}
            />

            <Route path="/visita" element={<Prospecto />} />

            <Route path="/prospecto" element={<ProspectoFormulario />} />
            <Route
              path="/prospecto/historial"
              element={<ProspectoHistorial />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
