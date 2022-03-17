import styles from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {
  return (
    props.show && (
      <div className={`${props.asOverlay && styles.loading_spinner_overlay}`}>
        <div className={styles.lds_dual_ring}></div>
      </div>
    )
  );
};

export default LoadingSpinner;
