import React, { useEffect } from 'react';
import styles from './index.module.css';

export default function Toast({ message, type, onClear }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  const iconClass = type === 'sucesso' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';

  return (
    <div className={`${styles.toastContainer} ${type === 'sucesso' ? styles.success : styles.error}`}>
      <i className={`bi ${iconClass} ${styles.icon}`}></i>
      <span>{message}</span>
    </div>
  );
}