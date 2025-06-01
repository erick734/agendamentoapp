import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectNome, logout } from '../../redux/authSlice';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import styles from './Header.module.css';

export default function Header() {
  const nomeUsuario = useSelector(selectNome);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar className={styles.navbar} expand="lg">
      <Navbar.Brand as={Link} to="/">Clínica Senac</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          {nomeUsuario ? (
            <NavDropdown title={`Olá, ${nomeUsuario}!`} id="basic-nav-dropdown" align="end" className={styles.userMenu}>
              <NavDropdown.Item as={Link} to={`/editar-perfil`}>
                Editar Perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as="button" onClick={handleLogout}>
                Sair
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}