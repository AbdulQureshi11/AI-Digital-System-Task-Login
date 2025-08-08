import { ErrorMessage, Form, Formik } from 'formik';
import bg from '../../Assests/123.jpg';
import Inputfield from '../../Common/Inputfield';
import * as Yup from "yup";
import PrimaryBtn from '../../Common/PrimaryBtn';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../Assests/logo.png';
import office from '../../Assests/Office.jpg';
import axios from 'axios';

const Logincomp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post("http://localhost:9000/api/loginUser", values);

      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Something went wrong during login.");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Field Required*'),
    password: Yup.string().required('Field Required*'),
  });

  return (
    <div className="relative flex w-full justify-center h-screen">

      {/* Message Bar for Login Required */}
      {message && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
          {message}
        </div>
      )}

      <div className='flex justify-end pr-10 items-center text-white h-[50px] w-[100%] bg-gray-800 absolute z-40 top-0'>
        {localStorage.getItem("token") ? (
          <Link to={'/dashboard'}>
            <h1>Dashboard</h1>
          </Link>
        ) : (
          <span className="opacity-50 cursor-not-allowed">Dashboard</span>
        )}
      </div>

      <img src={office} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-white/60"></div>

      <div className='w-[300px] rounded-2xl bg-[#005550] mt-20 absolute p-5'>
        <div className='flex justify-center'>
          <img src={logo} alt="" className='text-white w-[25%] flex justify-center filter invert brightness-0' />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className='mt-5 space-y-10'>
              <div className='text-white'>
                <Inputfield
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Enter Your Email'
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                />
                <ErrorMessage name="email" component='div' className='font-semibold text-white' />
              </div>

              <div className='text-white'>
                <Inputfield
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Enter Your Password'
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  className='rounded-md p-2 border-b placeholder:text-gray-300 text-sm text-center border-gray-400 w-full'
                />
                <ErrorMessage name="password" component='div' className='font-semibold text-white' />
              </div>

              <div className='flex justify-center'>
                <PrimaryBtn
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-white text-[#005550] transition-all font-semibold cursor-pointer w-[150px] flex justify-center items-center p-2 rounded-3xl'
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </PrimaryBtn>
              </div>
              <div className='flex border-t border-gray-500 pt-3 text-white text-sm justify-center'>
                Don't have Account?
                <Link className='flex items-center underline ml-3' to='/register'>
                  Register
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Logincomp;
