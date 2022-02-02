import React from 'react';
import Note from './Note';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadNotes } from '../../redux/user';

const NotesList = () => {
  const dispatch = useDispatch();
  const notesList = useSelector((state) => state.user.notes);

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  const content = notesList.map((note) => (
    <Note
      key={note.id}
      id={note.id}
      title={note.title}
      content={note.content}
      createdAt={note.createdAt}
      updatedAt={note.updatedAt}
    />
  ));
  return <div>{content}</div>;
};

export default NotesList;
