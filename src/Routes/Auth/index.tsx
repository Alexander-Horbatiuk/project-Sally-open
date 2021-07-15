import React from "react";
import {Switch, Route} from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Auth: React.FC = props => {
    return <Switch>
        <Route path={"/auth/sign-in"} component={SignIn} />
        <Route path={"/auth/sign-up"} component={SignUp} />
    </Switch>
};

export default Auth;