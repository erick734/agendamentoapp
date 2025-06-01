import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

export default function DeslogaBotao() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logout());
    navigate('/login');
  }

  return (
    <div className="position-fixed top-0 end-0 p-2" style={{ zIndex: 1050 }}>
      <button
        onClick={handleLogout}
        className="btn btn-danger btn-sm"
      >
        Sair
      </button>
    </div>
  );
}