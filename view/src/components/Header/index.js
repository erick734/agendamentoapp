import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser, logout } from '../../redux/authSlice';
import { Nav, Navbar, Container } from 'react-bootstrap'; 
import styles from './Header.module.css';

export default function Header() {
  const usuario = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
<Navbar className={styles.navbar} expand="lg">
  <Container>
    <Navbar.Brand as={Link} to="/">Clínica Senac</Navbar.Brand>
    {usuario && (
      <Nav className="ms-auto d-lg-none">
        <Nav.Link as="button" onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </Nav.Link>
      </Nav>
    )}

    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav>
        {usuario ? (
          <Nav.Link as="button" onClick={handleLogout} className={`${styles.logoutButton} d-none d-lg-inline-flex`}>
            Sair
          </Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}