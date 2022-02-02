import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createNote } from '../../redux/user';
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
    <form className={styles.form} onSubmit={formSubmissionHandler}>
      <input type='text' placeholder='Title' ref={titleRef} />
      <textarea placeholder='Text' ref={contentRef} />
      <div className={styles.buttons}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button type='submit'>Done</button>
      </div>
    </form>
  );
};

export default NewNoteForm;
