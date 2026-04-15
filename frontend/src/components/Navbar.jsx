import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.brand}>
          <span>TaskFlow</span>
          <span className={styles.dot} />
        </Link>

        <div className={styles.right}>
          <div className={styles.links}>
            <Link to="/dashboard" className={styles.link}>
              Dashboard
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin" className={styles.link}>
                Admin
              </Link>
            )}
          </div>

          {currentUser ? (
            <>
              <span className={styles.email}>{currentUser.email}</span>
              <span className={`${styles.badge} ${userRole === 'admin' ? styles.admin : styles.user}`}>
                {userRole || 'user'}
              </span>
              <button type="button" className={styles.logout} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className={styles.links}>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/register" className={styles.link}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
