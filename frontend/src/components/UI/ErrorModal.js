import Modal from './Modal';
import styles from './ErrorModal.module.css';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header='An Error Occurred!'
      show={!!props.error}
      footer={
        <button className={styles.ok_button} onClick={props.onClear}>
          Okay
        </button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
