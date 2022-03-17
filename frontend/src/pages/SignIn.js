import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '../redux/userAsyncThunks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Required'),
    password: yup.string().required('Required'),
  });

  const submitHandler = (values, { setSubmitting, resetForm }) => {
    const { email, password } = values;
    dispatch(fetchLogin({ email, password }));
    setSubmitting(false);
    resetForm();
    history.push('/home');
  };

  return (
    <div className={styles.container}>
      <Card className={styles.form}>
        <h2>Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor='email'>Email</label>
              <Field name='email' type='email' />
              <span className={styles.text}>
                <ErrorMessage className={styles.errorText} name='email' />
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor='password'>Password</label>
              <Field name='password' type='password' />
              <span>
                <ErrorMessage name='password' />
              </span>
            </div>
            <section className={styles.foot}>
              <FormButton className={styles.button} type='submit'>
                Sign In
              </FormButton>
              <Link to='/forgot_password'>forgot password?</Link>
            </section>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default SignIn;
