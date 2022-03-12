import { useState } from 'react';
import NotesList from '../components/notes/NotesList';
import ActionBar from '../components/layout/ActionsBar';
import NewNoteButton from '../components/notes/NewNoteButton';
import NewNoteForm from '../components/notes/NewNoteForm';
import styles from './Home.module.css';

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleFormHandler = () => {
    setShowForm((prevState) => !prevState);
  };

  const noteCreatedHandler = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.home}>
      <ActionBar />
      <NewNoteButton showActive={showForm} onClick={toggleFormHandler} />
      {showForm && (
        <NewNoteForm
          onSubmit={noteCreatedHandler}
          onCancel={toggleFormHandler}
        />
      )}
      <NotesList />
    </div>
  );
};

export default Home;
