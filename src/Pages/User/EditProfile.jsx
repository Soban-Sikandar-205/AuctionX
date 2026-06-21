import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { auth, databaseURL } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthProvider';
import Spinner from '../../Components/utils/Spinner';

function EditProfile() {
  const { currentUser } = useContext(AuthContext);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [userKey, setUserKey] = useState(null);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      userName: '',
      currentPassword: '',
      password: '',
      confirmPass: ''
    }
  });

  const watchPassword = watch('password', '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${databaseURL}/Users.json`);
        if (res.data) {
          const matched = Object.entries(res.data).find(
            ([, val]) => val.uid === currentUser?.uid
          );
          if (matched) {
            setUserKey(matched[0]);
            setValue('name', matched[1].name || '');
            setValue('userName', matched[1].userName || '');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfileError('Failed to load profile details.');
      } finally {
        setFetching(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    try {
      setProfileError(null);
      setProfileSuccess(null);

      // 1. Update name & userName in Firebase Realtime Database
      if (userKey) {
        await axios.patch(`${databaseURL}/Users/${userKey}.json`, {
          name: data.name,
          userName: data.userName
        });
      }

      // 2. Update password in Firebase Auth if provided
      if (data.password) {
        if (data.password.length < 6) {
          setProfileError('Password must be at least 6 characters long.');
          return;
        }
        if (data.password !== data.confirmPass) {
          setProfileError("Passwords don't match.");
          return;
        }
        try {
          const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword);
          await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (authErr) {
           setProfileError('Incorrect current password.');
           return;
        }

        await updatePassword(auth.currentUser, data.password);
      }

      setProfileSuccess('Profile updated successfully!');
      setValue('password', '');
      setValue('confirmPass', '');
    } catch (err) {
      console.error('Update profile error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setProfileError('For security, password changes require logging in again. Please log out and back in.');
      } else {
        setProfileError(err.message || 'An error occurred during updating profile.');
      }
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner />
        <span className="ml-3 text-slate-400 font-medium">Loading profile settings...</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] bg-slate-950 overflow-hidden py-10 px-4">
      {/* Floating 3D Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600 rounded-full filter blur-[100px] opacity-25 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 glass-card-dark p-8 rounded-2xl w-full max-w-md border border-slate-800/60 shadow-3d-elevated">
        <h2 className="text-2xl lg:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent tracking-tight">
          Profile Settings
        </h2>

        {profileSuccess && (
          <div className="bg-teal-950/30 border border-teal-500/20 text-teal-400 px-4 py-2.5 rounded-xl text-sm mb-5 text-center font-semibold">
            ✨ {profileSuccess}
          </div>
        )}

        {profileError && (
          <div className="bg-red-950/30 border border-red-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-sm mb-5 text-center font-semibold">
            ⚠️ {profileError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 text-xs uppercase tracking-wider pl-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Full Name"
              className="w-full p-3.5 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 text-xs uppercase tracking-wider pl-1">
              Email Address
            </label>
            <input
              type="text"
              value={currentUser?.email || ''}
              readOnly
              className="w-full p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-500 cursor-not-allowed focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 text-xs uppercase tracking-wider pl-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full p-3.5 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
              {...register('userName', { required: 'Username is required' })}
            />
            {errors.userName && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.userName.message}</span>}
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider pl-1">Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1 text-xs pl-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="w-full p-3.5 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
                  {...register('password')}
                />
              </div>

              {watchPassword && (
                <>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs pl-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Verify your current password"
                      className="w-full p-3.5 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
                      {...register('currentPassword', {
                        required: watchPassword ? "Current password is required to set a new one" : false
                      })}
                    />
                    {errors.currentPassword && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.currentPassword.message}</span>}
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs pl-1">
                      Confirm New Password
                    </label>
                  <input
                    type="password"
                    placeholder="Verify new password"
                    className="w-full p-3.5 rounded-xl input-3d bg-slate-900/60 border-slate-700/50 text-slate-900 placeholder-slate-500 focus:outline-none text-sm"
                    {...register('confirmPass', {
                      validate: value => value === watchPassword || "Passwords don't match"
                    })}
                  />
                  {errors.confirmPass && <span className="text-red-400 text-xs mt-1 block pl-1">{errors.confirmPass.message}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-white font-bold rounded-xl btn-3d-primary text-sm"
            >
              {isSubmitting ? 'Saving changes...' : 'Save Settings'}
            </button>
            
            <Link
              to="/"
              className="w-full py-2.5 bg-slate-800 border-b-4 border-slate-950 text-slate-200 hover:bg-slate-750 hover:text-white active:translate-y-0.5 active:border-b-2 text-xs font-bold rounded-xl transition-all duration-150 text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
