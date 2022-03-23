import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editNote, shareNote, deleteNote } from '../../redux/userAsyncThunks';
import EditNoteForm from '../forms/EditNoteForm';
import ShareNoteForm from '../forms/ShareNoteForm';
import DeleteNoteForm from '../forms/DeleteNoteForm';
import Card from '../UI/Card';
import ShareIcon from '../../assets/share-free-icon-font.svg';
import DeleteIcon from '../../assets/trash-free-icon-font.svg';
import EditIcon from '../../assets/pencil-free-icon-font.svg';
import CalendarIcon from '../../assets/calendar-free-icon-font-empty.svg';
import CancelIcon from '../../assets/cross-small-free-icon-font.svg';
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
              <button onClick={toggleShowDatesHandler}>
                {showDates ? (
                  <img
                    src={CancelIcon}
                    alt='share icon'
                    width='20px'
                    height='20px'
                  />
                ) : (
                  <img
                    src={CalendarIcon}
                    alt='share icon'
                    width='20px'
                    height='20px'
                  />
                )}
              </button>
              <button onClick={toggleIsEditingHandler}>
                <img
                  src={EditIcon}
                  alt='share icon'
                  width='20px'
                  height='20px'
                />
              </button>
              <button onClick={toggleIsSharingHandler}>
                <img
                  src={ShareIcon}
                  alt='share icon'
                  width='20px'
                  height='20px'
                />
              </button>
              <button onClick={toggleIsDeletingHandler}>
                <img
                  src={DeleteIcon}
                  alt='delete icon'
                  width='20px'
                  height='20px'
                />
              </button>
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
