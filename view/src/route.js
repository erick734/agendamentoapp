import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import AgendamentoConsulta from "./pages/AgendamentoConsulta";
import Login from "./pages/Login";
import EditarPerfil from "./pages/EditarPerfil";
import UsuarioLogadoProvider, { UsuarioContext } from "./context/Usuario";
import { useContext } from "react";

function PrivateRoute({ children }) {
  const { usuario } = useContext(UsuarioContext);
  if (!usuario?.logado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <UsuarioLogadoProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/editar-perfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
          <Route path="/agendamento-consulta/:id" element={<PrivateRoute><AgendamentoConsulta /></PrivateRoute>} />

          <Route path="/*"
            element={
              <PrivateRoute>
                <ProtecedLayout>
                  <Routes>
                    <Route path="/" element={<Consulta />} />
                    <Route path="/agendamento-consulta" element={<AgendamentoConsulta />} />
                  </Routes>
                </ProtecedLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </UsuarioLogadoProvider>
    </BrowserRouter>
  );

  function ProtecedLayout({ children }) {
    return (
      <>
        <Header />
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            {children}
          </div>
        </div>
        <Footer />
      </>
    );
  }
}