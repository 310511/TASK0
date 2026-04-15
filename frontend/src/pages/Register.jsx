import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createApiClient } from '../api/axiosInstance';
import { useToast } from '../hooks/useToast';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const token = await credential.user.getIdToken();

      const api = createApiClient();
      try {
        await api.post(
          '/api/v1/auth/register',
          { full_name: form.full_name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (profileError) {
        // Profile may already be created by the AuthContext token listener.
        if (profileError.response?.status !== 409) {
          throw profileError;
        }
      }

      showToast('Registered successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = {};
        err.response.data.error.details.forEach((item) => {
          errors[item.path] = item.msg;
        });
        setFieldErrors(errors);
      }
      showToast(err.response?.data?.error?.message || err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>✨</div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start organizing your work with TaskFlow.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              className={styles.input}
              name="full_name"
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.full_name && <p className={styles.errorMsg}>{fieldErrors.full_name}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={styles.input}
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
            <span className={styles.btnContent}>
              {isSubmitting && <span className={styles.spinner} />}
              {isSubmitting ? 'Creating account...' : 'Register'}
            </span>
          </button>
        </form>

        <p className={styles.hint}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
