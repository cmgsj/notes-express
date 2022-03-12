import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../../redux/user';
import styles from './ActionsBar.module.css';

const ActionsBar = () => {
  const dispatch = useDispatch();
  const { sortNotes, filterNotes } = userActions;
  const [searchFor, setSearchFor] = useState('');

  const sortSelectionHandler = (event) => {
    const selection = event.target.value;
    console.log('selection: ' + selection);
    dispatch(sortNotes({ selection }));
  };

  const searchForChangeHandler = (event) => {
    const enteredText = event.target.value;
    setSearchFor(enteredText);
    dispatch(filterNotes({ searchFor: enteredText }));
  };

  return (
    <div className={styles.bar}>
      <label>Sort By:</label>
      <select onChange={sortSelectionHandler}>
        <option value='last-edited-first'>last edited first</option>
        <option value='first-edited-first'>first edited first</option>
        <option value='last-created-first'>last created first</option>
        <option value='first-created-first'>first created first</option>
      </select>
      <input
        type='text'
        placeholder='search'
        value={searchFor}
        onChange={searchForChangeHandler}
      />
    </div>
  );
};

export default ActionsBar;
