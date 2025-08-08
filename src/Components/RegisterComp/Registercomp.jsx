import { ErrorMessage, Form, Formik } from 'formik';
import bg from '../../Assests/123.jpg';
import Inputfield from '../../Common/Inputfield';
import * as Yup from "yup";
import PrimaryBtn from '../../Common/PrimaryBtn';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assests/logo.png';
import office from '../../Assests/Office.jpg';
import axios from 'axios';

const Registercomp = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    mobile: '',
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post("http://localhost:9000/api/registerUser", values);

      if (res.data?.status?.toLowerCase() === "success") {
        alert("Registration successful! Please login.");
        resetForm();
        navigate("/");
      } else {
        alert(res.data?.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert(error.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Field Required*'),
    lastName: Yup.string().required('Field Required*'),
    username: Yup.string().required('Field Required*'),
    mobile: Yup.string().required('Field Required*'),
    email: Yup.string().email('Invalid email').required('Field Required*'),
    password: Yup.string().required('Field Required*'),
  });

  return (
    <div className="relative flex w-full justify-center h-screen">
      <img src={office} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-white/60"></div>

      <div className='w-[400px] rounded-2xl bg-[#005550] mt-5 absolute p-5'>
        <div className='flex justify-center'></div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className='mt-5 space-y-10'>
              {/* First Name */}
              <div className='text-white'>
                <Inputfield
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={values.firstName}
                  onChange={(e) => setFieldValue("firstName", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                />
                <ErrorMessage name="firstName" component='div' className='font-semibold text-white' />
              </div>

              {/* Last Name */}
              <div className='text-white'>
                <Inputfield
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={values.lastName}
                  onChange={(e) => setFieldValue("lastName", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                />
                <ErrorMessage name="lastName" component='div' className='font-semibold text-white' />
              </div>

              {/* Username */}
              <div className='text-white'>
                <Inputfield
                  type='text'
                  name='username'
                  placeholder='User Name'
                  value={values.username}
                  onChange={(e) => setFieldValue("username", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                />
                <ErrorMessage name="username" component='div' className='font-semibold text-white' />
              </div>

              {/* Mobile */}
              <div className='text-white'>
                <Inputfield
                  type='number'
                  name='mobile'
                  placeholder='Mobile Number'
                  value={values.mobile}
                  onChange={(e) => setFieldValue("mobile", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                  style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                />
                <ErrorMessage name="mobile" component='div' className='font-semibold text-white' />
              </div>

              {/* Email */}
              <div className='text-white'>
                <Inputfield
                  type='email'
                  name='email'
                  placeholder='Enter Your Email'
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  className=' rounded-md p-2 w-full border-b placeholder:text-gray-300 text-sm text-center border-gray-400'
                />
                <ErrorMessage name="email" component='div' className='font-semibold text-white' />
              </div>

              {/* Password */}
              <div className='text-white'>
                <Inputfield
                  type='password'
                  name='password'
                  placeholder='Enter Your Password'
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  className='rounded-md p-2 border-b placeholder:text-gray-300 text-sm text-center border-gray-400 w-full'
                />
                <ErrorMessage name="password" component='div' className='font-semibold text-white' />
              </div>

              {/* Submit Button */}
              <div className='flex justify-center'>
                <PrimaryBtn
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-white text-[#005550] transition-all font-semibold cursor-pointer w-[150px] flex justify-center items-center p-2 rounded-3xl'
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </PrimaryBtn>
              </div>

              {/* Login Link */}
              <div className='flex border-t border-gray-500 pt-3 text-white text-sm justify-center'>
                Already Have Account?
                <Link className='flex items-center underline ml-3' to='/'>
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Registercomp;
