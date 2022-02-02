import { Fragment, useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import styles from './Auth.module.css';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleLoginFormHandler = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <Fragment>
      <div className={styles.header}>
        <h1>Notes</h1>
      </div>
      <div className={styles.auth}>
        {showLogin && <LoginForm />}
        {!showLogin && <SignupForm />}
        <button
          className={styles.switch_button}
          onClick={toggleLoginFormHandler}
        >
          {`Switch to ${showLogin ? 'Create Account' : 'Login'}`}
        </button>
      </div>
    </Fragment>
  );
};

export default Auth;
