import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

export default function SideBar({ expanded, setExpanded }) {
  return (
    <aside
      className={`${styles.sidebar} ${expanded ? styles.sidebarExpanded : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={styles.sidebarContent}>
        <img
          src="https://www.mg.senac.br/programasenacdegratuidade/assets/img/senac_logo_branco.png"
          alt="Logo Senac"
          style={{ maxWidth: "120px", margin: "10px auto" }}
        />
        <ul className="nav flex-column">
          {/* <li className="nav-item">
            <Link className={styles["nav-link"]} to="/">
              Consultas
            </Link>
          </li>
          <li className="nav-item">
            <Link className={styles["nav-link"]} to="/agendamento-consulta">
              Agendar Consulta
            </Link>
          </li> */}
          <li className="nav-item">
            <Link className={styles["nav-link"]} to="/editar-perfil">
              Editar Perfil
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}