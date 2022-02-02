import { useDispatch } from 'react-redux';
import { userActions } from '../../redux/user';
import styles from './MainNavigation.module.css';

const MainNavigation = () => {
  const dispatch = useDispatch();
  const { logout } = userActions;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        <div>
          <h1 className={styles.text}>Notes</h1>
        </div>
        <div>
          <button className={styles.menu_button} onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
