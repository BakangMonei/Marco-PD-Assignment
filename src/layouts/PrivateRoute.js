import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./LoginPage";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import RegistrationPage from "./RegistrationPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <Router>
      <Switch>
        <Route path="/LoginPage" component={LoginPage} />
        <PrivateRoute
          path="/UserDashboard"
          component={UserDashboard}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/ForgotPassword"
          component={ForgotPassword}
          authenticated={authenticated}
        />
        <PrivateRoute
          path="/RegistrationPage"
          component={RegistrationPage}
          authenticated={authenticated}
        />
      </Switch>
    </Router>
  );
}

export default App;
