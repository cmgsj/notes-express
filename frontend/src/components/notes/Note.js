import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editNote, shareNote, deleteNote } from '../../redux/userAsyncThunks';
import EditNoteForm from '../forms/EditNoteForm';
import ShareNoteForm from '../forms/ShareNoteForm';
import DeleteNoteForm from '../forms/DeleteNoteForm';
import Card from '../UI/Card';
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
    <>
      {!isEditing && (
        <Card className={styles.note}>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          {!(isDeleting || isSharing) && (
            <div className={styles.buttons}>
              <button onClick={toggleShowDatesHandler}>●●●</button>
              <button onClick={toggleIsEditingHandler}>✏️</button>
              <button onClick={toggleIsSharingHandler}>↗️</button>
              <button onClick={toggleIsDeletingHandler}>❌</button>
            </div>
          )}
          {showDates && (
            <div className={styles.dates}>
              <span>
                {'Updated: ' + new Date(props.updatedAt).toLocaleString()}
              </span>
              <span>
                {'Created: ' + new Date(props.createdAt).toLocaleString()}
              </span>
            </div>
          )}
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
        </Card>
      )}
      {isEditing && (
        <EditNoteForm
          onCancel={toggleIsEditingHandler}
          onSubmit={submitEditNoteHandler}
          defaultTitle={props.title}
          defaultContent={props.content}
        />
      )}
    </>
  );
};

export default Note;
