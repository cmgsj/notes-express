import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSignup } from '../redux/userAsyncThunks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmed_password: '',
  };

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required('Required')
      .max(15, 'Must be 15 characters or less'),
    lastName: yup
      .string()
      .required('Required')
      .max(20, 'Must be 20 characters or less'),
    email: yup.string().email('Invalid email address').required('Required'),
    password: yup
      .string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and One Special Character'
      ),
    confirmed_password: yup
      .string()
      .required('Required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const submitHandler = (values, { setSubmitting, resetForm }) => {
    const { firstName, lastName, email, password, confirmed_password } = values;
    if (password === confirmed_password) {
      dispatch(fetchSignup({ firstName, lastName, email, password }));
    }
    setSubmitting(false);
    resetForm();
    history.push('/home');
  };

  return (
    <div className={styles.container}>
      <Card className={styles.form}>
        <h2>Create Account</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor='firstName'>First Name</label>
              <Field name='firstName' type='text' />
              <span>
                <ErrorMessage name='firstName' />
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor='lastName'>Last Name</label>
              <Field name='lastName' type='text' />
              <span>
                <ErrorMessage name='lastName' />
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor='email'>Email</label>
              <Field name='email' type='email' />
              <span>
                <ErrorMessage name='email' />
              </span>
            </div>
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
                Sign up
              </FormButton>
            </section>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default SignUp;
