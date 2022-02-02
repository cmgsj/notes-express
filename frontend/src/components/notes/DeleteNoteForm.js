import styles from './DeleteNoteForm.module.css';

const DeleteNoteForm = (props) => {
  const submitFormHandler = (event) => {
    event.preventDefault();
    props.onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={submitFormHandler}>
      <h3>Are you sure you want to delete?</h3>
      <button type='submit'>Yes</button>
      <button type='button' onClick={props.onCancel}>
        No
      </button>
    </form>
  );
};

export default DeleteNoteForm;
