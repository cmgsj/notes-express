import React from 'react';
import NewNoteButton from '../components/notes/NewNoteButton';
import Layout from '../components/layout/Layout';
import NotesList from '../components/notes/NotesList';

const Home = () => {
  return (
    <Layout>
      <NewNoteButton />
      <NotesList />
    </Layout>
  );
};

export default Home;
