export default function DeslogaBotao(){
  
    function handleLogout(e){
        e.preventDefault();
      logout();
    }
  
    return (
        <div className="position-fixed top-0 end-0 p-2">
            <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
            >
                Sair
            </button>
        </div>
    );
}
