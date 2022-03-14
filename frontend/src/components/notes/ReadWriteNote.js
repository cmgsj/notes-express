import { Fragment, useState } from 'react';
import EditNoteForm from './forms/EditNoteForm';
import styles from './Note.module.css';

const ReadWriteNote = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsEditingHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const submitEditNoteHandler = (title, content) => {
    props.onSubmit(title, content);
    setIsEditing(false);
  };

  return (
    <Fragment>
      {!isEditing && (
        <div className={styles.note}>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <div className={styles.buttons}>
            <button onClick={toggleIsEditingHandler}>✏️</button>
          </div>
        </div>
      )}
      {isEditing && (
        <EditNoteForm
          onCancel={toggleIsEditingHandler}
          onSubmit={submitEditNoteHandler}
          defaultTitle={props.title}
          defaultContent={props.content}
        />
      )}
    </Fragment>
  );
};

export default ReadWriteNote;
