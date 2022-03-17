import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../redux/user';
import SideDrawer from '../UI/SideDrawer';
import styles from './MainNavigation.module.css';

const MainNavigation = () => {
  const path = useLocation().pathname;
  const history = useHistory();
  const dispatch = useDispatch();
  const { logout } = userActions;
  const { isLoggedIn } = useSelector((state) => state.user);
  const [showDrawer, setShowDrawer] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const toggleDrawerHandler = () => {
    setShowDrawer((state) => !state);
  };

  const closeDrawerHandler = () => {
    setShowDrawer(false);
  };

  const goToHomeHandler = () => {
    history.push('/');
  };

  const goToSignInHandler = () => {
    history.push('/sign_in');
  };

  const goToSignUpHandler = () => {
    history.push('/sign_up');
  };

  return (
    <header className={styles.header}>
      <SideDrawer show={showDrawer} onClick={closeDrawerHandler}>
        <div className={styles.drawer}>
          <button>Home</button>
          <button>Profile</button>
          <button>Shared with me</button>
          <button>Share</button>
          <button>Settings</button>
          <button>About</button>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </SideDrawer>
      <div className={styles.menu}>
        <h2 className={styles.text} onClick={goToHomeHandler}>
          Notes Express
        </h2>
        {isLoggedIn && (
          <div>
            <button
              className={`${styles.menu_button} ${styles.icon}`}
              onClick={toggleDrawerHandler}
            >
              {showDrawer ? '×' : '≡'}
            </button>
          </div>
        )}
        {!isLoggedIn && (
          <div>
            {path !== '/sign_in' && (
              <button
                className={styles.menu_button}
                onClick={goToSignInHandler}
              >
                Sign In
              </button>
            )}
            {path !== '/sign_up' && (
              <button
                className={styles.menu_button}
                onClick={goToSignUpHandler}
              >
                Sign Up
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNavigation;
