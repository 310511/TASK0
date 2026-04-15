import { useEffect, useState } from 'react';
import { createApiClient } from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import { useToast } from '../hooks/useToast';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const api = createApiClient();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (value) => {
    const source = (value || 'NA').trim();
    return source.slice(0, 2).toUpperCase();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/api/v1/auth/users'),
        api.get('/api/v1/tasks', { params: { page: 1, limit: 50 } })
      ]);
      setUsers(usersRes.data.data.users);
      setTasks(tasksRes.data.data.tasks);
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/api/v1/auth/role/${user.id}`, { role: nextRole });
      showToast('Role updated', 'success');
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to update role', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>
        <span>🛡️</span> <span>Admin Panel</span>
      </h2>

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.card}>
          <h3 className={styles.sectionHeader}>Users</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name / Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.avatar}>{getInitials(user.full_name || user.email)}</div>
                    </td>
                    <td>
                      <div>{user.full_name || 'No name'}</div>
                      <div className={styles.email}>{user.email}</div>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${user.role === 'admin' ? styles.adminBadge : styles.userBadge}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className={`${styles.roleButton} ${
                          user.role === 'admin' ? styles.demote : styles.promote
                        }`}
                        onClick={() => toggleRole(user)}
                      >
                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h3 className={styles.sectionHeader}>Tasks</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.users?.email || 'Unknown'}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        task.status === 'done'
                          ? styles.done
                          : task.status === 'in_progress'
                            ? styles.inProgress
                            : styles.pending
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{task.priority}</td>
                  <td>{new Date(task.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
