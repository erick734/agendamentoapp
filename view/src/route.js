import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./redux/authSlice";

// Páginas
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import AgendamentoConsulta from "./pages/AgendamentoConsulta";
import Login from "./pages/Login";
import EditarPerfil from "./pages/EditarPerfil";

// Layouts
import ProtectedLayout from "./layouts/ProtectedLayout";

// Rota privada
function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Redirecionamento
function CatchAllRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
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

        {/* Rota catch-all */}
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
