import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUsuario } from "./redux/authSlice";
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import AgendamentoConsulta from "./pages/AgendamentoConsulta";
import Login from "./pages/Login";
import EditarPerfil from "./pages/EditarPerfil";

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

function ProtectedLayout() {
  const usuario = useSelector(selectUsuario);
  return (
    <>
      <Header usuario={usuario} />
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

function CatchAllRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas privadas */}
        <Route
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Consulta />} />
          <Route path="editar-perfil" element={<EditarPerfil />} />
          <Route path="agendamento-consulta" element={<AgendamentoConsulta />} />
          <Route path="agendamento-consulta/:id" element={<AgendamentoConsulta />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
