import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (currentUser === null) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.email !== 'admin@auctionex.com') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
