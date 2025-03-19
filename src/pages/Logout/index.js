import { useUsuarioContext } from "../../context/Usuario";

export default function DeslogaBotao(){ 
    const {logout} = useUsuarioContext ();
  
    function handleLogout(e){
        e.preventDefault();
      logout();
    }
  
    return (
        <button 
            onClick={handleLogout} 
            className="btn btn-danger desloga-botao">
            Sair
        </button>
    );
}