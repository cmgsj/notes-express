import React, { Fragment, useState } from 'react';
import NewNoteForm from './NewNoteForm';
import styles from './NewNoteButton.module.css';

const ActionBar = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleFormHandler = () => {
    setShowForm((prevState) => !prevState);
  };

  const noteCreatedHandler = () => {
    setShowForm(false);
  };

  return (
    <Fragment>
      <div className={styles.menu}>
        <button
          onClick={toggleFormHandler}
          style={{
            color: 'white',
            backgroundColor: showForm ? 'red' : 'dodgerblue',
          }}
        >
          {showForm ? '-' : '+'}
        </button>
      </div>
      {showForm && (
        <NewNoteForm
          onSubmit={noteCreatedHandler}
          onCancel={toggleFormHandler}
        />
      )}
    </Fragment>
  );
};

export default ActionBar;
