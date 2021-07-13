import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import DashboardComponent from "./components/Dashboard";
import LoginComponent from "./components/Login";
import SignupComponent from "./components/Signup";
import ChangePasswordComponent from "./components/Password/change";
import ForgotPasswordComponent from "./components/Password/forgot";
import ProfileComponent from "./components/Profile/index";
import PublicProfileComponent from "./components/Profile/public";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={DashboardComponent} />
        <Route exact path="/login" component={LoginComponent} />
        <Route path="/signup" component={SignupComponent} />
        <Route path="/change-password" component={ChangePasswordComponent} />
        <Route path="/forgot-password" component={ForgotPasswordComponent} />
        <Route path="/profile/public" component={PublicProfileComponent} />
        <Route path="/profile" component={ProfileComponent} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
