import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import styles from './Auth.module.css';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleLoginFormHandler = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <div className={styles.auth}>
      {showLogin ? <LoginForm /> : <SignupForm />}
      <button className={styles.switch_button} onClick={toggleLoginFormHandler}>
        {`${showLogin ? 'Create Account' : 'Login'}`}
      </button>
    </div>
  );
};

export default Auth;
