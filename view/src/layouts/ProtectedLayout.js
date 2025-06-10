import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import styles from './ProtectedLayout.module.css';

export default function ProtectedLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      
      <SideBar expanded={isSidebarExpanded} setExpanded={setIsSidebarExpanded} />
      
      <main className={styles.mainContent}>
        <Header />
        <div className={styles.contentOutlet}>
          <Outlet />
        </div>
        <Footer />
      </main>

    </div>
  );
}