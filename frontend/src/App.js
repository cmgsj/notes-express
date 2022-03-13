import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from './redux/user';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Guest from './pages/Guest';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorModal from './components/UI/ErrorModal';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

let logoutTimer;

const App = () => {
  const dispatch = useDispatch();
  const { token, tokenExpirationDate, isLoggedIn, isLoading, error } =
    useSelector((state) => state.user);
  const { login, logout, clearError } = userActions;

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => dispatch(logout()), remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [dispatch, token, logout, tokenExpirationDate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    if (
      token &&
      tokenExpirationDate &&
      new Date(tokenExpirationDate) > new Date()
    ) {
      const expirationDate = new Date(tokenExpirationDate).toISOString();
      dispatch(login({ token, expirationDate }));
    }
  }, [dispatch, login]);

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route exact path='/home'>
          <Home />
        </Route>
        <Route exact path='/guest/:token'>
          <Guest />
        </Route>
        <Route path='*'>
          <Redirect to='/home' />
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path='/auth'>
          <Auth />
        </Route>
        <Route exact path='/guest/:token'>
          <Guest />
        </Route>
        <Route exact path='/reset_password'>
          <ForgotPassword />
        </Route>
        <Route exact path='/reset_password/:token'>
          <ResetPassword />
        </Route>
        <Route path='*'>
          <Redirect to='/auth' />
        </Route>
      </Switch>
    );
  }
  return (
    <Fragment>
      <LoadingSpinner show={isLoading} asOverlay />
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Layout>
        <Router>{routes}</Router>
      </Layout>
    </Fragment>
  );
};

export default App;
