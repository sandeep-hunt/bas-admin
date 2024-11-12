import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Protected = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // Decode the token to get the user info (assuming the token contains 'username')
  const decodedToken = jwtDecode(token);
  const username = decodedToken.username; // Assuming the token has a 'username' field
  const id = decodedToken.id; // Assuming the token has a 'id' field

  // Pass the decoded username as a prop to children components
  return React.cloneElement(children, { username,id });
};

export default Protected;
