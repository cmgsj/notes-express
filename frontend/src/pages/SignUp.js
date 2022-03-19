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
    confirmedPassword: '',
  };

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required('Required')
      .min(2, 'Must have at least 2 characters')
      .max(20, 'Must have at most 20 characters'),
    lastName: yup
      .string()
      .required('Required')
      .min(2, 'Must have at least 2 characters')
      .max(20, 'Must have at most 20 characters'),
    email: yup.string().required('Required').email('Invalid email address'),
    password: yup
      .string()
      .required('Required')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Must have at least 8 characters, one uppercase, one number and one special case character'
      ),
    confirmedPassword: yup
      .string()
      .required('Required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const submitHandler = (values, { setSubmitting, resetForm }) => {
    const { firstName, lastName, email, password, confirmedPassword } = values;
    if (password === confirmedPassword) {
      dispatch(
        fetchSignup({ firstName, lastName, email, password, confirmedPassword })
      );
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
              <label htmlFor='confirmedPassword'>Confirm Password</label>
              <Field name='confirmedPassword' type='password' />
              <span>
                <ErrorMessage name='confirmedPassword' />
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
