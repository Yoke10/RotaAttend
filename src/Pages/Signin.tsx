//@ts-nocheck
import  { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { auth } from '../lib/Firebase.config';
import { useSignInWithGoogle, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useFirebase } from '../lib/context';
import { useNavigate } from 'react-router-dom';

function Signin() {
  // State for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Google Sign-In Hook
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
  
  // Email/Password Sign-In Hook
  const [signInWithEmailAndPassword, userEmail, loadingEmail, errorEmail] = useSignInWithEmailAndPassword(auth);


  // onauthstate
   const {user}=useFirebase();

  const router = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSignIn = (e:Event) => {
    e.preventDefault(); // Prevent default form submission
    signInWithEmailAndPassword(email, password);
  };
  
  useEffect(() => {
    if (userGoogle || userEmail|| user) {
      router('/'); // Redirect to home page after sign in
    }
   
  }, [userGoogle, userEmail, router, user])



  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='w-9/12 h-[90vh] flex bg-slate-300 shadow-lg rounded-2xl'>
        <div className='w-6/12 h-full flex flex-col items-center justify-center space-y-6'>
          <p className='font-bold text-black text-5xl'>Login</p>
          <p className='font-semibold text-black text-xl'>Welcome to Result Wiz</p>

          {/* Email input */}
          <div className="flex items-center bg-white rounded-xl shadow-md p-4 w-3/4">
            <FaUser className="text-gray-400 text-xl mr-4" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email" 
              className="w-full outline-none text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Password input with eye icon */}
          <div className="flex items-center bg-white rounded-xl shadow-md p-4 w-3/4">
            <MdOutlinePassword className="text-gray-400 text-xl mr-4" />
            <input 
              type={showPassword ? "text" : "password"}  
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password" 
              className="w-full outline-none text-gray-600 placeholder-gray-400"
            />
            <button onClick={togglePasswordVisibility} className="ml-4 text-gray-500">
              {showPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
            </button>
          </div>

          {/* Sign In with Email Button */}
          <button className="flex items-center justify-center w-3/4 bg-blue-500 text-white rounded-xl shadow-md py-2 transition hover:bg-blue-600"
            disabled={loadingEmail} 
            onClick={()=>handleEmailSignIn}>
            <span className="text-md font-semibold">Sign in with Email</span>
            {loadingEmail && <p className="text-gray-200">Loading...</p>}
            {errorEmail && <p className="text-red-500">{errorEmail.message}</p>}
          </button>

          {/* 'or' divider */}
          <div className="flex items-center w-3/4">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 text-gray-600">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          {/* Google Sign-in Button */}
          <button className="flex items-center justify-center w-3/4 bg-white text-black rounded-xl shadow-md py-2 transition hover:bg-gray-100"
            disabled={loadingGoogle} 
            onClick={()=>signInWithGoogle()}>
            <FaGoogle className="text-red-500 text-2xl mr-3" />
            <span className="text-md font-semibold">Sign in with Google</span>
            {loadingGoogle && <p className="text-gray-600">Loading...</p>}
            {errorGoogle && <p className="text-red-500">{errorGoogle.message}</p>}
          </button>

        </div>  

        <div className='w-6/12 h-full overflow-hidden rounded-r-2xl'>
          <img 
            width={400} 
            height={400} 
            alt='logo' 
            src='/images/logo.jpg' 
            className='object-cover w-full h-full' 
          />
        </div>

      </div>
    </div>
  );
}

export default Signin;
