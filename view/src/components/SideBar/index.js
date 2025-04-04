import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

export default function SideBar() {
  return (
    <div className={`${styles.sidebar} d-flex flex-column vh-100 bg-dark text-light`}>
      <div className="p-3 text-center">
        <img
          src="https://www.mg.senac.br/programasenacdegratuidade/assets/img/senac_logo_branco.png"
          alt="Logo"
          className="img-fluid- md-2"
          style={{ maxWidth: "120px" }}
        />
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-light" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <a
            className="nav-link text-light"
            data-bs-toggle="collapse"
            href="#submenuCadastro"
            role="button"
            aria-expanded="false"
            aria-controls="submenuCadastro"
          >
            Agendamento
          </a>
          <ul className="collapse list-unstyled ms-3" id="submenuCadastro">
            <li>
              <Link to="/agendamento-consulta" className="nav-link text-light">
                Agendar Consulta
              </Link>
              <Link to="/lista-consultas" className="nav-link text-light">
                Consultas Marcadas
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/editar-perfil">
            Editar Perfil
          </Link>
        </li>
      </ul>
    </div>
  );
}