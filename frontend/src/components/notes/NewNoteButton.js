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
      <button
        className={styles.new}
        onClick={toggleFormHandler}
        style={{
          backgroundColor: showForm ? 'red' : 'dodgerblue',
        }}
      >
        {showForm ? '−' : '+'}
      </button>
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
