import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../redux/user';
import styles from './ShareNoteForm.module.css';

const ShareNoteForm = (props) => {
  const urlRef = useRef();
  const [hasExpirationTime, setHasExpirationTime] = useState(false);
  const [expirationTime, setExpirationTime] = useState('24');
  const [selectedPermission, setSelectedPermission] = useState('READ_ONLY');
  
  const dispatch = useDispatch();
  const { clearSharingToken } = userActions;
  const sharingToken = useSelector((state) => state.user.sharingToken);

  const toggleHasExpirationTimeHandler = () => {
    setHasExpirationTime((prevState) => !prevState);
  };

  const copyUrlToClipboardHandler = async () => {
    const url = urlRef.current.value;
    await navigator.clipboard.writeText(url);
    alert('URL copied to clipboard.');
    props.onCancel();
    dispatch(clearSharingToken());
  };

  const selectedPermissionChangeHandler = (event) => {
    setSelectedPermission(event.target.value);
  };

  const expirationTimeChangeHandler = (event) => {
    setExpirationTime(event.target.value);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (hasExpirationTime) {
      props.onSubmit(selectedPermission, expirationTime);
    } else {
      props.onSubmit(selectedPermission);
    }
  };

  return (
    <form className={styles.form} onSubmit={submitFormHandler}>
      <div className={styles.exp}>
        <label>Expiration</label>
        <input type='checkbox' onChange={toggleHasExpirationTimeHandler} />
        {hasExpirationTime && (
          <div>
            <input
              className={styles.exp_time}
              type='number'
              min='0'
              value={expirationTime}
              onChange={expirationTimeChangeHandler}
            />
            <label>hours</label>
          </div>
        )}
      </div>
      <div>
        <label>Permission</label>
        <select
          value={selectedPermission}
          onChange={selectedPermissionChangeHandler}
        >
          <option value='READ_ONLY'>Read Only</option>
          <option value='READ_WRITE'>Read and Write</option>
        </select>
      </div>
      {sharingToken && (
        <div>
          <input
            className={styles.url}
            type='text'
            value={`http://localhost:3000/guest/${sharingToken}`}
            readOnly
            ref={urlRef}
          />
          <button type='button' onClick={copyUrlToClipboardHandler}>
            copy url
          </button>
        </div>
      )}
      <div>
        <button type='button' onClick={props.onCancel}>
          cancel
        </button>
        <button type='submit'>share</button>
      </div>
    </form>
  );
};

export default ShareNoteForm;
