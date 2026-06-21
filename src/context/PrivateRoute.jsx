import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
  const {currentUser} = useContext(AuthContext)

  if(currentUser === null)
    return <Navigate to= '/login' replace />
  
  return children
  
}
export default PrivateRoute
