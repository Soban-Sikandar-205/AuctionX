import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [loginError, setLoginError] = useState(null);
 const navigate = useNavigate()

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log('Logged in:', userCredential.user);
      console.log(userCredential.user.email)
      navigate('/');
      
      

      
  } catch (error) {
    setLoginError(error.message || 'Incorrect email or password')
    console.error('Login error:', error.message);
  }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
      {/* Floating 3D Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600 rounded-full filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-500 rounded-full filter blur-[90px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 glass-card-dark p-8 rounded-2xl w-full max-w-md border border-slate-800/60 shadow-3d-elevated transition-transform duration-500 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
          Welcome Back
        </h2>
        


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Your Email Address"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('email', { required: "Email is required" })}
            />
            {errors.email && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Your Password"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('password', { required: "Password is required" })}
            />
            {errors.password && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.password.message}</span>}
          </div>

          {loginError && <span className="text-red-400 text-sm block text-center bg-red-950/30 border border-red-500/20 py-2 rounded-lg">{loginError}</span>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 text-white font-bold rounded-xl btn-3d-primary ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Loading...' : 'Submit'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
