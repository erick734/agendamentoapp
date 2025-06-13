import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./redux/authSlice";

import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import AgendamentoConsulta from "./pages/AgendamentoConsulta";
import Login from "./pages/Login";
import EditarPerfil from "./pages/EditarPerfil";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import AdminEmpresas from "./pages/AdminEmpresa";

import ProtectedLayout from "./layouts/ProtectedLayout";

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function CatchAllRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Consulta />} />
          <Route path="editar-perfil" element={<EditarPerfil />} />
          <Route path="cadastro-empresa" element={<CadastroEmpresa />} />
          
          <Route path="admin/empresas" element={<AdminEmpresas />} />
          
          <Route path="agendamento-consulta" element={<AgendamentoConsulta />} />
          <Route path="agendamento-consulta/:id" element={<AgendamentoConsulta />} />
        </Route>

        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </BrowserRouter>
  );
}