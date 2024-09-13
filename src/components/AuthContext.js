import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [providerToken, setProviderToken] = useState(localStorage.getItem('provider_token')); // Stockez le provider token

  

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, providerToken, setProviderToken }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

