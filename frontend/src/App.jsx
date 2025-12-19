import React, { Fragment } from "react";
import AppRouter from "./router/Router";
import AppContext from "./context/AppContext";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const context = {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated
  }

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
