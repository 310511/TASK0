import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={`${styles.line} ${styles.title}`} />
      <div className={`${styles.line} ${styles.desc}`} />
      <div className={`${styles.line} ${styles.descShort}`} />
      <div className={`${styles.line} ${styles.descShort}`} />
    </div>
  );
};

export default SkeletonCard;
