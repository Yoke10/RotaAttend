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
   const {user,fbl}=useFirebase();

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

if(fbl)
{
  return<div>Loading....</div>
}

  return (
     <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-purple-400 to-blue-500 px-4">
      <div className="w-[500px] max-w-5xl h-[90vh] bg-white rounded-2xl shadow-xl flex overflow-hidden">
        
        {/* Left Image */}
        {/* <div className="w-1/2 hidden md:block">
          <img
            src="/rotao.png"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
        </div> */}

        {/* Right Login Panel */}
        <div className="w-full flex flex-col items-center justify-center px-8 space-y-6 text-center">
        <div className="flex items-center justify-center">
          <img src="/rotao.png" width={400} height={50}/>
       </div>
          {/* <h1 className="text-4xl font-bold text-gray-800">Login</h1> */}
          <p className="text-lg text-gray-600">Welcome Back</p>

          {/* Email Input */}
          <div className="flex items-center bg-gray-100 rounded-xl shadow-md px-4 py-3 w-full max-w-md">
            <FaUser className="text-gray-400 text-xl mr-3" />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-gray-100 rounded-xl shadow-md px-4 py-3 w-full max-w-md">
            <MdOutlinePassword className="text-gray-400 text-xl mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button onClick={togglePasswordVisibility} className="ml-3 text-gray-500">
              {showPassword ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
            </button>
          </div>

          {/* Sign In Button */}
          <button
            className="bg-red-600 cursor-pointer text-white font-semibold py-2 px-6 rounded-xl w-full max-w-md shadow-md"
            onClick={handleEmailSignIn}
            disabled={loadingEmail}
          >
            {loadingEmail ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Error Message */}
          {errorEmail && (
            <p className="text-red-500 text-sm">{errorEmail.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signin;
  {/* Google Sign-in Button */}
          {/* <button className="flex items-center justify-center w-3/4 bg-white text-black rounded-xl shadow-md py-2 transition hover:bg-gray-100"
            disabled={loadingGoogle} 
            onClick={()=>signInWithGoogle()}>
            <FaGoogle className="text-red-500 text-2xl mr-3" />
            <span className="text-md font-semibold">Sign in with Google</span>
            {loadingGoogle && <p className="text-gray-600">Loading...</p>}
            {errorGoogle && <p className="text-red-500">{errorGoogle.message}</p>}
          </button> */}