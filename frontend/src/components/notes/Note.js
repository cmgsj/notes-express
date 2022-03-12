import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editNote, shareNote, deleteNote } from '../../redux/userAsyncThunks';
import EditNoteForm from './EditNoteForm';
import ShareNoteForm from './ShareNoteForm';
import DeleteNoteForm from './DeleteNoteForm';
import styles from './Note.module.css';

const Note = (props) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showDates, setShowDates] = useState(false);

  const toggleIsEditingHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const toggleIsSharingHandler = () => {
    setIsSharing((prevState) => !prevState);
  };

  const toggleIsDeletingHandler = () => {
    setIsDeleting((prevState) => !prevState);
  };

  const toggleShowDatesHandler = () => {
    setShowDates((prevState) => !prevState);
  };

  const submitEditNoteHandler = (title, content) => {
    dispatch(editNote({ id: props.id, title, content }));
    setIsEditing(false);
  };

  const submitShareNoteHandler = (permission, expiresIn) => {
    dispatch(
      shareNote({ noteId: props.id, permission, expiresIn: +expiresIn })
    );
  };

  const submitDeleteNoteHandler = () => {
    dispatch(deleteNote(props.id));
  };

  return (
    <Fragment>
      {!isEditing && (
        <div className={styles.note}>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <section>
            <section>
              <span>
                {showDates &&
                  'Updated: ' + new Date(props.updatedAt).toLocaleString()}
              </span>
              <span>
                {showDates &&
                  'Created: ' + new Date(props.createdAt).toLocaleString()}
              </span>
            </section>
            <div className={styles.buttons}>
              <button onClick={toggleShowDatesHandler}>●●●</button>
              <button onClick={toggleIsEditingHandler}>✏️</button>
              <button onClick={toggleIsSharingHandler}>↗️</button>
              <button onClick={toggleIsDeletingHandler}>🗑</button>
            </div>
          </section>
          {isDeleting && (
            <DeleteNoteForm
              onCancel={toggleIsDeletingHandler}
              onSubmit={submitDeleteNoteHandler}
            />
          )}
          {isSharing && (
            <ShareNoteForm
              onCancel={toggleIsSharingHandler}
              onSubmit={submitShareNoteHandler}
            />
          )}
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

export default Note;
