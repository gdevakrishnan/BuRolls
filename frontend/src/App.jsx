import React, { Fragment } from "react";
import AppRouter from "./router/Router";
import AppContext from "./context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { setAuthToken } from './serviceWorkers/api';
import { me } from './serviceWorkers/authServices';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const context = {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated
  }

  // Persist login: read token from localStorage and fetch current user
  useEffect(() => {
    const token = localStorage.getItem('burolls-token');
    if (token) {
      setAuthToken(token);
      me().then((res) => {
        if (res?.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          // invalid token
          localStorage.removeItem('burolls-token');
          setAuthToken(null);
        }
      });
    }
  }, []);

  useEffect(() => console.log(user), [user]);

  return (
    <Fragment>
      <AppContext.Provider value = { context }>
        <AppRouter />
      </AppContext.Provider>
    </Fragment>
  );
};

export default App;
