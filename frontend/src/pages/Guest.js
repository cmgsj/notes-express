import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReadOnlyNote from '../components/notes/ReadOnlyNote';
import ReadWriteNote from '../components/notes/ReadWriteNote';
import ErrorModal from '../components/UI/ErrorModal';
import styles from './Guest.module.css';

// const backendURL = process.env.REACT_APP_BACKEND_URL;
const backendURL = 'http://192.168.86.69:8000/api';

const Guest = () => {
  const params = useParams();
  const [readOnlyNote, setReadOnlyNote] = useState(null);
  const [readWriteNote, setReadWriteNote] = useState(null);
  const [error, setError] = useState(null);

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
        setError(error.message);
      }
    };
    if (!readOnlyNote && !readWriteNote) {
      fetchNote();
    }
  }, [params, readOnlyNote, readWriteNote]);

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

  const clearErrorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <div className={styles.top}>
        <h2>Shared with you</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.note}>
          <ErrorModal error={error} onClear={clearErrorHandler} />
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
    </Fragment>
  );
};

export default Guest;
