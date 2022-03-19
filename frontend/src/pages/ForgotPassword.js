import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendPasswordResetLink } from '../redux/userAsyncThunks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [showSentMessage, setShowSentMessage] = useState(false);

  const initialValues = { email: '' };
  const validationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Required'),
  });

  const submitHandler = (values, { setSubmitting, resetForm }) => {
    const { email } = values;
    dispatch(sendPasswordResetLink(email));
    setSubmitting(false);
    resetForm();
    setShowSentMessage(true);
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
              <label htmlFor='email'>Email</label>
              <Field name='email' type='email' />
              <span>
                <ErrorMessage name='email' />
              </span>
            </div>
            <section className={styles.foot}>
              <FormButton className={styles.button} type='submit'>
                Submit
              </FormButton>
            </section>
          </Form>
        </Formik>
        {showSentMessage && (
          <p className={styles.afterMessage}>
            A link has been sent to your email.
            <br />
            It is valid for one hour.
          </p>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
