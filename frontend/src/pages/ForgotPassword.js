import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/user';

const ForgotPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setError } = userActions;
  const emailRef = useRef();

  const sendCodeHandler = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/reset_password/send_code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
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
  };

  return (
    <form onSubmit={sendCodeHandler}>
      <label>Email</label>
      <input type='email' placeholder='email' ref={emailRef} />
      <button type='submit'>Send</button>
    </form>
  );
};

export default ForgotPassword;
