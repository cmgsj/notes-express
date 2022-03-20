import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/user';
import ReadOnlyNote from '../components/notes/ReadOnlyNote';
import ReadWriteNote from '../components/notes/ReadWriteNote';
import styles from './Guest.module.css';

const backendURL = process.env.REACT_APP_BACKEND_URL;
// const backendURL = 'http://192.168.0.15:8000/api';

const Guest = () => {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setError } = userActions;
  const [readOnlyNote, setReadOnlyNote] = useState(null);
  const [readWriteNote, setReadWriteNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = params.token;
        const response = await fetch(`${backendURL}/shared/${token}`);
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        } else {
          if (responseData.permission === 'READ_ONLY') {
            setReadOnlyNote(responseData.note);
          } else if (responseData.permission === 'READ_WRITE') {
            setReadWriteNote(responseData.note);
          }
        }
      } catch (error) {
        dispatch(setError({ message: error.message }));
        history.replace('/');
      }
    };
    if (!readOnlyNote && !readWriteNote) {
      fetchNote();
    }
  });

  const submitEditNoteHandler = async (title, content) => {
    try {
      const token = params.token;
      const response = await fetch(`${backendURL}/shared/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        setReadWriteNote(responseData.note);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        {readOnlyNote && (
          <ReadOnlyNote
            title={readOnlyNote.title}
            content={readOnlyNote.content}
          />
        )}
        {readWriteNote && (
          <ReadWriteNote
            title={readWriteNote.title}
            content={readWriteNote.content}
            onSubmit={submitEditNoteHandler}
          />
        )}
      </div>
    </div>
  );
};

export default Guest;
