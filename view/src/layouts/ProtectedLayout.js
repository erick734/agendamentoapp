import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import styles from './ProtectedLayout.module.css';

export default function ProtectedLayout() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      <main className={`${styles.mainContent} ${expanded ? styles.mainContentExpanded : ''}`}>
        <Header />
        <div className={styles.contentOutlet}>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}