import { createContext, useContext, useMemo, useState } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

const iconByType = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, closing: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast))
      );
    }, 3300);

    setTimeout(() => removeToast(id), 3500);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]} ${toast.closing ? styles.dismiss : ''}`}
            role="status"
          >
            <span className={styles.icon}>{iconByType[toast.type] || iconByType.info}</span>
            <span className={styles.message}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
