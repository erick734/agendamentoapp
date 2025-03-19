import { createContext, useContext, useState } from "react";
 
export const UsuarioContext = createContext();
 
UsuarioContext.displayName = "Usuario";
 
export default function UsuarioProvider({children}) {
 
    const [ usuario, setUsuario ] = useState([]);
 
    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    )
}
 
export function useUsuarioContext () {
 
    const {usuario, setUsuario} = useContext(UsuarioContext);
 
    function login(usuarioLogin) {

        return setUsuario(usuarioLogin);
    }

    function logout() {
        setUsuario([])
    }
 
    return{
        usuario,
        login,
        logout
    };
}