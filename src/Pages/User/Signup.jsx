import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, databaseURL } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  userName: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPass: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPass, {
  path: ['confirmPass'],
  message: "Passwords don't match",
});

function Signup() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      password: '',
      confirmPass: '',
    },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data) => {
    try {
      setSignupError(null);
      console.log('Submitting signup. Database URL:', databaseURL);
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);


      await axios.post(`${databaseURL}/Users.json`, {
        ...data,
        uid: user.uid,
        confirmPass: null
      });

      console.log('User registered and details saved successfully');
      navigate('/login');

    } catch (error) {
      console.log('error error error', error);
      setSignupError(error.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden py-10">
      {/* Floating 3D Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600 rounded-full filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-500 rounded-full filter blur-[90px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 glass-card-dark p-8 rounded-2xl w-full max-w-md border border-slate-800/60 shadow-3d-elevated transition-transform duration-500 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
          Create Account
        </h2>
        {signupError && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm mb-5 text-center">
            {signupError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Full Name"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('name')}
            />
            {errors.name && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.name.message}</span>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Username of your choice"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('userName')}
            />
            {errors.userName && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.userName.message}</span>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Your Email Address"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('email')}
            />
            {errors.email && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter a Password"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('password')}
            />
            {errors.password && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.password.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Retype your Password"
              className="w-full p-4 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none"
              {...register('confirmPass')}
            />
            {errors.confirmPass && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.confirmPass.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 text-white font-bold rounded-xl btn-3d-primary ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-colors">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;
