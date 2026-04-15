import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const priorityClass = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow
  }[task.priority] || styles.priorityMedium;

  const badgeClass = {
    high: styles.badgeHigh,
    medium: styles.badgeMedium,
    low: styles.badgeLow
  }[task.priority] || styles.badgeMedium;

  const statusClass = {
    pending: styles.statusPending,
    in_progress: styles.statusInProgress,
    done: styles.statusDone
  }[task.status] || styles.statusPending;

  const createdAt = task.created_at ? new Date(task.created_at).toLocaleDateString() : '--';

  return (
    <article className={`${styles.card} ${priorityClass}`}>
      <div className={styles.topRow}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={`${styles.priorityBadge} ${badgeClass}`}>{task.priority}</span>
      </div>

      <p className={styles.description}>{task.description || 'No description added.'}</p>
      <span className={`${styles.status} ${statusClass}`}>{task.status.replace('_', ' ')}</span>

      <div className={styles.bottomRow}>
        <span className={styles.date}>Created {createdAt}</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.edit}`}
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.delete}`}
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
