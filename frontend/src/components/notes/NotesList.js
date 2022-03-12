import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadNotes } from '../../redux/userAsyncThunks';
import Note from './Note';
import styles from './NotesList.module.css';

const NotesList = () => {
  const dispatch = useDispatch();
  const notesList = useSelector((state) => state.user.notes);

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  return (
    <div className={styles.notes}>
      {notesList.length === 0 ? (
        <div className={styles.none}>No Notes Found</div>
      ) : (
        notesList.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            createdAt={note.createdAt}
            updatedAt={note.updatedAt}
          />
        ))
      )}
    </div>
  );
};

export default NotesList;
