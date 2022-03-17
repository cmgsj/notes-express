import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux/user';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const ResetPassword = () => {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setError } = userActions;

  const initialValues = { password: '', confirmed_password: '' };

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Required'),
    confirmed_password: yup
      .string()
      .oneOf([yup.ref('password') /*, null*/], 'Passwords must match')
      .required('Required'),
  });

  const submitHandler = (values, actions) => {
    const { password, confirmed_password } = values;
    if (password === confirmed_password) {
      fetchResetPassword(params.token, password);
      history.push('/home');
    }
  };

  const fetchResetPassword = async (token, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/reset_password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (error) {
      dispatch(setError({ message: error.message }));
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.form}>
        <h2>Reset Password</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor='password'>Password</label>
              <Field name='password' type='password' />
              <span>
                <ErrorMessage name='password' />
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor='confirmed_password'>Confirm Password</label>
              <Field name='confirmed_password' type='password' />
              <span>
                <ErrorMessage name='confirmed_password' />
              </span>
            </div>
            <section className={styles.foot}>
              <FormButton className={styles.button} type='submit'>
                Submit
              </FormButton>
            </section>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default ResetPassword;
