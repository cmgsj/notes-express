import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../redux/user';
import SideDrawer from '../UI/SideDrawer';
import MenuIcon from '../../assets/menu-burger-free-icon-font-white.svg';
import CancelIcon from '../../assets/cross-small-free-icon-font.svg';
import HomeIcon from '../../assets/home-free-icon-font-white.svg';
import ArrowLeftIcon from '../../assets/arrow-left-free-icon-font-white.svg';
import ArrowRightIcon from '../../assets/arrow-right-free-icon-font-white.svg';
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

  const goBackHandler = () => {
    history.goBack();
  };

  const goForthHandler = () => {
    history.goForward();
  };

  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        {!window.matchMedia('(display-mode: standalone)').matches && (
          <h2 className={styles.text} onClick={goToHomeHandler}>
            Notes Express
          </h2>
        )}
        {window.matchMedia('(display-mode: standalone)').matches && (
          <div>
            <button
              className={`${styles.menu_button} ${styles.icon}`}
              onClick={goToHomeHandler}
            >
              <img
                src={HomeIcon}
                alt='cancel icon'
                width='20px'
                height='20px'
              />
            </button>
            <button
              className={`${styles.menu_button} ${styles.icon}`}
              onClick={goBackHandler}
            >
              <img
                src={ArrowLeftIcon}
                alt='cancel icon'
                width='20px'
                height='20px'
              />
            </button>
            <button
              className={`${styles.menu_button} ${styles.icon}`}
              onClick={goForthHandler}
            >
              <img
                src={ArrowRightIcon}
                alt='cancel icon'
                width='20px'
                height='20px'
              />
            </button>
          </div>
        )}
        {isLoggedIn && (
          <div>
            <button
              className={`${styles.menu_button}  ${styles.icon} ${
                showDrawer && styles.active
              }`}
              onClick={toggleDrawerHandler}
            >
              {showDrawer ? (
                <img
                  src={CancelIcon}
                  alt='cancel icon'
                  width='20px'
                  height='20px'
                />
              ) : (
                <img
                  src={MenuIcon}
                  alt='cancel icon'
                  width='20px'
                  height='20px'
                />
              )}
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
      <SideDrawer show={showDrawer} onClick={closeDrawerHandler}>
        <div className={styles.drawer}>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </SideDrawer>
    </header>
  );
};

export default MainNavigation;
