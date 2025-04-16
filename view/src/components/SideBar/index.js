import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

export default function SideBar() {
  return (
    <div className={`${styles.sidebar} text-center d-flex flex-column vh-100 bg-dark text-light`}>
      <div className={`${styles.sidebarContent} text-center`}>
        <img
          src="https://www.mg.senac.br/programasenacdegratuidade/assets/img/senac_logo_branco.png"
          alt="Logo"
          className="img-fluid mb-2"
          style={{ maxWidth: "120px" }}
        />
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className="nav-link text-light"
              data-bs-toggle="collapse"
              href="#submenuCadastro"
              role="button"
              aria-expanded="false"
              aria-controls="submenuCadastro"
            >
              Configurações
            </a>
            <ul className="collapse list-unstyled ms-3" id="submenuCadastro">
              <li>
                <Link className="nav-link text-light" to="/editar-perfil">
                  Editar Perfil
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
