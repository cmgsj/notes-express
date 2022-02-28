import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '../../redux/userAsyncThunks';
import styles from './AuthForm.module.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitLoginFormHandler = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    dispatch(fetchLogin({ email, password }));
    history.push('/home');
  };

  return (
    <form className={styles.form} onSubmit={submitLoginFormHandler}>
      <h2>Login</h2>
      <label>Email</label>
      <input type='email' ref={emailRef} placeholder='email' />
      <label>Password</label>
      <input type='password' ref={passwordRef} placeholder='password' />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default LoginForm;
