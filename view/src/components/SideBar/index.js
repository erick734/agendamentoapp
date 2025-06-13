import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/authSlice';
import styles from "./sidebar.module.css";

export default function SideBar({ expanded, setExpanded }) {
  const user = useSelector(selectUser);

  const homePath = user?.perfil === 'a' ? '/admin/empresas' : '/';
  const homeText = user?.perfil === 'a' ? 'Home (Empresas)' : 'Home (Consultas)';
  const homeIcon = user?.perfil === 'a' ? 'bi-diagram-3-fill' : 'bi-house-door-fill';

  return (
    <>
      <button 
        className={styles.menuButton} 
        onClick={() => setExpanded(true)}
        aria-label="Abrir menu"
      >
        <i className="bi bi-list"></i>
      </button>

      <div 
        className={`${styles.sidebarOverlay} ${expanded ? styles.overlayVisible : ''}`}
        onClick={() => setExpanded(false)}
      ></div>

      <aside className={`${styles.sidebar} ${expanded ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <img
            src="https://www.mg.senac.br/programasenacdegratuidade/assets/img/senac_logo_branco.png"
            alt="Logo Senac"
          />
          <button 
            className={styles.closeButton} 
            onClick={() => setExpanded(false)}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>
        
        <ul className={styles.navList}>
          <li>
            <Link className={styles.navLink} to={homePath} onClick={() => setExpanded(false)}>
              <i className={`bi ${homeIcon}`}></i>
              <span>{homeText}</span>
            </Link>
          </li>
          
          <li>
            <Link className={styles.navLink} to="/editar-perfil" onClick={() => setExpanded(false)}>
              <i className="bi bi-person-fill-gear"></i>
              <span>Editar Perfil</span>
            </Link>
          </li>
          
          {user?.perfil === 'a' && (
            <li>
              <Link className={styles.navLink} to="/cadastro-empresa" onClick={() => setExpanded(false)}>
                <i className="bi bi-building-fill-add"></i>
                <span>Cadastrar Empresa</span>
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </>
  );
}