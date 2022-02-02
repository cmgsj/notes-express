import { useRef } from 'react';
import styles from './EditNoteForm.module.css';

const EditNoteForm = (props) => {
  const editedTitleRef = useRef();
  const editedContentRef = useRef();

  const submitFormHandler = (event) => {
    event.preventDefault();
    const title = editedTitleRef.current.value;
    const content = editedContentRef.current.value;
    props.onSubmit(title, content);
  };

  return (
    <form className={styles.form} onSubmit={submitFormHandler}>
      <input
        type='text'
        defaultValue={props.defaultTitle}
        ref={editedTitleRef}
      />
      <textarea
        defaultValue={props.defaultContent}
        ref={editedContentRef}
      ></textarea>
      <div className={styles.buttons}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button type='submit'>Done</button>
      </div>
    </form>
  );
};

export default EditNoteForm;
