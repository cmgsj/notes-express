import { useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from './redux/user';
import { fetchResetToken } from './redux/userAsyncThunks';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorModal from './components/UI/ErrorModal';
const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Guest = lazy(() => import('./pages/Guest'));
const MainNavigation = lazy(() =>
  import('./components/navigation/MainNavigation')
);
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

let logoutTimer;

const App = () => {
  const dispatch = useDispatch();
  const { token, tokenExpirationDate, isLoggedIn, isLoading, error } =
    useSelector((state) => state.user);
  const { login, clearError } = userActions;

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(
        () => dispatch(fetchResetToken()),
        remainingTime
      );
    } else {
      clearTimeout(logoutTimer);
    }
  }, [dispatch, token, tokenExpirationDate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    if (
      token &&
      refreshToken &&
      tokenExpirationDate &&
      new Date(tokenExpirationDate) > new Date()
    ) {
      const expirationDate = new Date(tokenExpirationDate).toISOString();
      dispatch(login({ token, refreshToken, expirationDate }));
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
        <Route exact path='/sign_in'>
          <SignIn />
        </Route>
        <Route exact path='/sign_up'>
          <SignUp />
        </Route>
        <Route exact path='/guest/:token'>
          <Guest />
        </Route>
        <Route exact path='/forgot_password'>
          <ForgotPassword />
        </Route>
        <Route exact path='/reset_password/:token'>
          <ResetPassword />
        </Route>
        <Route path='*'>
          <Redirect to='/sign_in' />
        </Route>
      </Switch>
    );
  }
  return (
    <Router>
      <LoadingSpinner show={isLoading} asOverlay />
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Suspense fallback={<LoadingSpinner show={true} asOverlay />}>
        <MainNavigation />
        {routes}
      </Suspense>
    </Router>
  );
};

export default App;
