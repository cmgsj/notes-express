import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../redux/user';
import FormButton from '../UI/FormButton';
import styles from './ShareNoteForm.module.css';

const ShareNoteForm = (props) => {
  const urlRef = useRef();
  const [hasExpirationTime, setHasExpirationTime] = useState(true);
  const [expirationTime, setExpirationTime] = useState('24');
  const [selectedPermission, setSelectedPermission] = useState('READ_ONLY');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { clearSharingToken } = userActions;
  const sharingToken = useSelector((state) => state.user.sharingToken);

  const toggleHasExpirationTimeHandler = () => {
    setHasExpirationTime((prevState) => !prevState);
  };

  const copyUrlToClipboardHandler = async () => {
    const url = urlRef.current.value;
    await navigator.clipboard.writeText(url);
    alert('URL Copied To clipboard');
    props.onCancel();
    dispatch(clearSharingToken());
  };

  const selectedPermissionChangeHandler = (event) => {
    setSelectedPermission(event.target.value);
  };

  const expirationTimeChangeHandler = (event) => {
    setExpirationTime(event.target.value);
  };

  const cancelFormHandler = () => {
    dispatch(clearSharingToken());
    props.onCancel();
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (hasExpirationTime) {
      props.onSubmit(selectedPermission, expirationTime);
    } else {
      props.onSubmit(selectedPermission);
    }
    setIsSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {!isSubmitted && (
        <form className={styles.form} onSubmit={submitFormHandler}>
          <label>Share Note</label>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Expiration</label>
              <input
                className={styles.checkbox}
                type='checkbox'
                defaultChecked
                onChange={toggleHasExpirationTimeHandler}
              />
              {hasExpirationTime && (
                <div className={styles.expiration}>
                  <input
                    type='number'
                    min='1'
                    max='99'
                    value={expirationTime}
                    onChange={expirationTimeChangeHandler}
                  />
                  <label>hours</label>
                </div>
              )}
            </div>
            <div className={styles.field}>
              <label>Permission</label>
              <select
                className={styles.permissions}
                value={selectedPermission}
                onChange={selectedPermissionChangeHandler}
              >
                <option value='READ_ONLY'>Read Only</option>
                <option value='READ_WRITE'>Read and Write</option>
              </select>
            </div>
          </div>
          <div>
            <FormButton title='cance' onClick={cancelFormHandler}>
              Cancel
            </FormButton>
            <FormButton type='submit' title='submit'>
              Share
            </FormButton>
          </div>
        </form>
      )}
      {isSubmitted && (
        <div className={styles.urlSection}>
          <input
            className={styles.url}
            type='text'
            value={`http://localhost:3000/guest/${sharingToken}`}
            readOnly
            ref={urlRef}
          />
          <FormButton onClick={copyUrlToClipboardHandler}>Copy</FormButton>
          <FormButton onClick={cancelFormHandler}>Cancel</FormButton>
        </div>
      )}
    </div>
  );
};

export default ShareNoteForm;
