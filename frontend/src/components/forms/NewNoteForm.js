import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createNote } from '../../redux/userAsyncThunks';
import FormButton from '../UI/FormButton';
import Card from '../UI/Card';
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
    <Card className={styles.card}>
      <form className={styles.newNote} onSubmit={formSubmissionHandler}>
        <input type='text' placeholder='Title' ref={titleRef} />
        <textarea placeholder='Content' ref={contentRef} />
        <div className={styles.buttons}>
          <FormButton cancel onClick={props.onCancel}>
            Cancel
          </FormButton>
          <FormButton type='submit'>Done</FormButton>
        </div>
      </form>
    </Card>
  );
};

export default NewNoteForm;
