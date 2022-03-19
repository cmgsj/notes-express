import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../redux/userAsyncThunks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const ResetPassword = () => {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const initialValues = { password: '', confirmedPassword: '' };

  const validationSchema = yup.object({
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

  const submitHandler = (values, actions) => {
    const { password, confirmedPassword } = values;
    if (password === confirmedPassword) {
      dispatch(
        resetPassword({ token: params.token, password, confirmedPassword })
      );
      history.push('/home');
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
              <label htmlFor='password'>New Password</label>
              <Field name='password' type='password' />
              <span>
                <ErrorMessage name='password' />
              </span>
            </div>
            <div className={styles.field}>
              <label htmlFor='confirmedPassword'>Confirm New Password</label>
              <Field name='confirmedPassword' type='password' />
              <span>
                <ErrorMessage name='confirmedPassword' />
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
