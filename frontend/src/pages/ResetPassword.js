import { useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/user';

const ResetPassword = () => {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setError } = userActions;
  const passwordRef = useRef();
  const repeatedPasswordRef = useRef();

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    const token = params.token;
    const password = passwordRef.current.value;
    const repeatedPassword = repeatedPasswordRef.current.value;
    if (password === repeatedPassword) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/reset_password/${token}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (error) {
        dispatch(setError({ message: error.message }));
      }
      history.replace('/');
    }
  };

  return (
    <form onSubmit={resetPasswordHandler}>
      <input type='password' placeholder='new password' ref={passwordRef} />
      <br />
      <input
        type='password'
        placeholder='retype password'
        ref={repeatedPasswordRef}
      />
      <br />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default ResetPassword;
