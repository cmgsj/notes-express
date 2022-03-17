import { useState } from 'react';
import NotesList from '../components/notes/NotesList';
import ActionBar from '../components/navigation/ActionsBar';
import NewNoteButton from '../components/UI/NewNoteButton';
import NewNoteForm from '../components/forms/NewNoteForm';
import styles from './Home.module.css';

const Home = () => {
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  const toggleFormHandler = () => {
    setShowNewNoteForm((prevState) => !prevState);
  };

  const noteCreatedHandler = () => {
    setShowNewNoteForm(false);
  };

  return (
    <div className={styles.home}>
      <ActionBar />
      <NewNoteButton active={showNewNoteForm} onClick={toggleFormHandler} />
      {showNewNoteForm && (
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
