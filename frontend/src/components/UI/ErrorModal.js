import Modal from './Modal';
import styles from './ErrorModal.module.css';
import FormButton from './FormButton';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header='An Error Occurred!'
      show={!!props.error}
      footer={
        <FormButton cancel className={styles.ok_button} onClick={props.onClear}>
          Close
        </FormButton>
      }
    >
      <p className={styles.errorMessage}>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
