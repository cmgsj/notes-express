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
    dispatch(sortNotes({ selection }));
  };

  const searchForChangeHandler = (event) => {
    const enteredText = event.target.value;
    setSearchFor(enteredText);
    dispatch(filterNotes({ searchFor: enteredText }));
  };

  return (
    <div className={styles.bar}>
      <div className={styles.actions}>
        <select onChange={sortSelectionHandler}>
          <option disabled>Sort</option>
          <option value='newest-edited'>newest edited</option>
          <option value='oldest-edited'>oldest edited </option>
          <option value='newest-created'>newest created</option>
          <option value='oldest-created'>oldest created</option>
        </select>
        <input
          type='text'
          placeholder='search'
          value={searchFor}
          onChange={searchForChangeHandler}
        />
      </div>
    </div>
  );
};

export default ActionsBar;
