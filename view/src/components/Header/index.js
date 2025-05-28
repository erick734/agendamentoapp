import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUsuario, logout } from '../../redux/authSlice';

export default function Header() {
  const usuario = useSelector(selectUsuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {usuario ? (
          <>
            <span>Olá, {usuario.nome}!</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}