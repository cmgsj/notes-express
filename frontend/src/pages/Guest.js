import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSharedNote, updateSharedNote } from '../redux/userAsyncThunks';
import SharedNote from '../components/notes/SharedNote';
import styles from './Guest.module.css';

const Guest = () => {
  const token = useParams().token;
  const dispatch = useDispatch();
  const { sharedNote, sharedNotePermission } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!sharedNote) {
      dispatch(getSharedNote({ token }));
    }
  }, [dispatch, sharedNote, token]);

  const submitEditNoteHandler = async (title, content) => {
    dispatch(updateSharedNote({ token, title, content }));
  };

  return (
    <div className={styles.container}>
      {sharedNote && (
        <SharedNote
          readOnly={sharedNotePermission === 'READ_ONLY'}
          title={sharedNote.title}
          content={sharedNote.content}
          onSubmit={submitEditNoteHandler}
        />
      )}
    </div>
  );
};

export default Guest;
