import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createNote } from '../../redux/userAsyncThunks';
import styles from './NewNoteForm.module.css';

const NewNoteForm = (props) => {
  const dispatch = useDispatch();
  const titleRef = useRef();
  const contentRef = useRef();

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    dispatch(createNote({ title, content }));
    props.onSubmit();
  };

  return (
    <form className={styles.newNote} onSubmit={formSubmissionHandler}>
      <input type='text' placeholder='Title' ref={titleRef} />
      <textarea placeholder='Text' ref={contentRef} />
      <div className={styles.buttons}>
        <button
          className={styles.cancelButton}
          type='button '
          onClick={props.onCancel}
        >
          Cancel
        </button>
        <button className={styles.doneButton} type='submit'>
          Done
        </button>
      </div>
    </form>
  );
};

export default NewNoteForm;
