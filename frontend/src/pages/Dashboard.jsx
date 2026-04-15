import { useEffect, useState } from 'react';
import { createApiClient } from '../api/axiosInstance';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../hooks/useToast';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const api = createApiClient();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/tasks', {
        params: { page, limit, status: status || undefined, priority: priority || undefined }
      });
      setTasks(response.data.data.tasks);
      setTotal(response.data.data.total);
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, status, priority]);

  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    try {
      await api.post('/api/v1/tasks', payload);
      showToast('Task created', 'success');
      setIsFormOpen(false);
      setActiveTask(null);
      await fetchTasks();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/api/v1/tasks/${id}`, payload);
      showToast('Task updated', 'success');
      setIsFormOpen(false);
      setActiveTask(null);
      await fetchTasks();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/tasks/${id}`);
      showToast('Task deleted', 'success');
      await fetchTasks();
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to delete task', 'error');
    }
  };

  const totalTasks = total;
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Tasks</h1>
        <p>Manage your tasks below</p>
      </header>

      <section className={styles.statsRow}>
        <article className={styles.statCard}>
          <p className={styles.statValue}>{totalTasks}</p>
          <p className={styles.statLabel}>Total Tasks</p>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statValue}>{completedTasks}</p>
          <p className={styles.statLabel}>Completed</p>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statValue}>{pendingTasks}</p>
          <p className={styles.statLabel}>Pending</p>
        </article>
      </section>

      <div className={styles.filters}>
        <select className={styles.select} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className={styles.select} value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="button"
          className={styles.newTaskButton}
          onClick={() => {
            setActiveTask(null);
            setIsFormOpen(true);
          }}
        >
          + New Task
        </button>
      </div>

      <section className={styles.grid}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(selected) => {
                  setActiveTask(selected);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}

        {!loading && tasks.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyEmoji}>📋</p>
            <h3>No tasks yet</h3>
            <p>Create your first task</p>
            <button
              type="button"
              className={styles.emptyAction}
              onClick={() => {
                setActiveTask(null);
                setIsFormOpen(true);
              }}
            >
              + New Task
            </button>
          </div>
        )}
      </section>

      <div className={styles.pagination}>
        <button className={styles.pagerButton} disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span className={styles.pagerInfo}>Page {page}</span>
        <button
          className={styles.pagerButton}
          disabled={page * limit >= total}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setActiveTask(null);
        }}
        title={activeTask ? 'Edit Task' : 'Create Task'}
        submitText={activeTask ? 'Update Task' : 'Create Task'}
        initialValues={
          activeTask
            ? {
                title: activeTask.title,
                description: activeTask.description || '',
                priority: activeTask.priority || 'medium',
                status: activeTask.status || 'pending'
              }
            : { title: '', description: '', priority: 'medium', status: 'pending' }
        }
        isSubmitting={isSubmitting}
        onSubmit={(payload) => {
          if (activeTask) {
            handleUpdate(activeTask.id, payload);
            return;
          }
          handleCreate(payload);
        }}
      />
    </div>
  );
};

export default Dashboard;
