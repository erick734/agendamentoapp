import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/editar-perfil"
          element={<PrivateRoute><EditarPerfil /></PrivateRoute>}
        />
        <Route
          path="/agendamento-consulta/:id"
          element={<PrivateRoute><AgendamentoConsulta /></PrivateRoute>}
        />
        <Route
          path="/agendamento-consulta"
          element={<PrivateRoute><AgendamentoConsulta /></PrivateRoute>}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Consulta />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <CatchAllRoute />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedLayout({ children }) {
  const usuario = useSelector(selectUsuario);

  return (
    <>
      <Header usuario={usuario} />
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">{children}</div>
      </div>
      <Footer />
    </>
  );
}

function CatchAllRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}