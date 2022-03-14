import styles from './FormButton.module.css';

const FormButton = (props) => {
  return (
    <button
      className={`${styles.formButton} ${
        props.cancel ? styles.cancelButton : styles.submitButton
      }`}
      type={props.type || 'button'}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default FormButton;
