import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, databaseURL } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import Loading from '../Components/utils/Loading';
import axios from 'axios';


function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, isLoading] = useState(true)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user)=>{
            if (user) {
              try {
                const res = await axios.get(`${databaseURL}/Users.json`);
                if (res.data) {
                  const matched = Object.values(res.data).find(
                    (val) => val.uid === user.uid
                  );
                  setUserData(matched || null);
                }
              } catch (e) {
                console.error("Failed to fetch user data", e);
              }
            } else {
              setUserData(null);
            }
            setCurrentUser(user)
            isLoading(false)

        })



        return ()=>unsubscribe()
    }, [])

   

    const logout = async () => {
      try {
          await signOut(auth)
          setCurrentUser(null)
          setUserData(null)
          console.log('User signed out');
      } catch (error) {
          console.error('Logout error:', error.message);
      }

    }


    if (loading) {
      return (
       <Loading />
      );
    }

  return (
    <AuthContext.Provider value = {{currentUser,setCurrentUser, logout, userData}}>
        {children}
    </AuthContext.Provider>
  )
}

export const AuthContext = React.createContext()

export default AuthProvider
