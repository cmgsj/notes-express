import styles from './FormButton.module.css';

const FormButton = (props) => {
  return (
    <button
      className={`${styles.formButton} ${props.className}`}
      title={props.title}
      type={props.type || 'button'}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default FormButton;
