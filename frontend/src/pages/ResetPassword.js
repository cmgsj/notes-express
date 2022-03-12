import { useRef } from 'react';

const ResetPassword = () => {
  const emailRef = useRef();

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/send_code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        return responseData;
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={resetPasswordHandler}>
      <label>Email</label>
      <input type='email' placeholder='email' ref={emailRef} />
      <button type='submit'>Send</button>
    </form>
  );
};

export default ResetPassword;
