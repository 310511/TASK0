import { useEffect, useState } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  submitText = 'Save',
  title = 'Create Task',
  isSubmitting = false
}) => {
  const [form, setForm] = useState(
    initialValues || { title: '', description: '', priority: 'medium', status: 'pending' }
  );

  useEffect(() => {
    setForm(initialValues || { title: '', description: '', priority: 'medium', status: 'pending' });
  }, [initialValues, isOpen]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3 className={styles.title}>{title}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              className={styles.input}
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className={`${styles.input} ${styles.textarea}`}
              name="description"
              placeholder="Task description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-status">
              Status
            </label>
            <select id="task-status" className={styles.input} name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className={styles.input}
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.submit}`} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
