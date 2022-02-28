import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSignup } from '../../redux/userAsyncThunks';
import styles from './AuthForm.module.css';

const SignupForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const submitSignupFormHandler = (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password === confirmPassword) {
      dispatch(fetchSignup({ name, email, password }));
      history.push('/home');
    }
  };

  return (
    <form className={styles.form} onSubmit={submitSignupFormHandler}>
      <h2>Create Account</h2>
      <label>Name</label>
      <input type='text' ref={nameRef} placeholder='name' />
      <label>Email</label>
      <input type='email' ref={emailRef} placeholder='email' />
      <label>Password</label>
      <input type='password' ref={passwordRef} placeholder='passwrd' />
      <label>Confirm Password</label>
      <input
        type='password'
        ref={confirmPasswordRef}
        placeholder='confirm password'
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default SignupForm;
