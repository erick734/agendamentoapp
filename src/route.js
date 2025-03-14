import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import Consulta from "./pages/Consulta"
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import AgendamentoConsulta from "./pages/AgendamentoConsulta"
import Login from "./pages/Login";
import UsuarioLogadoProvider, { UsuarioContext } from "./context/Usuario";
import { useContext } from "react";

function PrivateRoute({ children }) {
    
    const usuario = useContext(UsuarioContext);
    if (!usuario?.logado) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <UsuarioLogadoProvider>

                <Routes>
                    <Route path="/login" element={<Login />} ></Route>
                    <Route path="/"
                        element={
                            <PrivateRoute>
                                <Route path="/home" element={<Home />} ></Route>
                                <Route path="/cadastro" element={<Cadastro />} ></Route>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </UsuarioLogadoProvider>
        </BrowserRouter>
    )
    /*
    <Header />
    <div className="d-flex">
    <SideBar />
    <div className="flex-grow-1 p-4">
    */

}