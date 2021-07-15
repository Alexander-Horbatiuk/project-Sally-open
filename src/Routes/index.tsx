import React from "react";
import {Route, Switch} from "react-router-dom";
import Venue from './Venue';
import Auth from './Auth';
import Home from "./Home";
import VenueDetails from "./VenueDetails";
import PrivateRoute from "../Components/PrivateRoute";
import Stripe from "./Stripe";
import WelcomePage from "./WelcomePage";


const Routes: React.FC = props => {
    return <Switch>
        <Route path={"/auth"} component={Auth} />
        <PrivateRoute path={"/venue/add"}>
            <Venue/>
        </PrivateRoute>
        <PrivateRoute path={"/venue/:id"}>
            <VenueDetails/>
        </PrivateRoute>
        <PrivateRoute path={"/stripe"}>
            <Stripe/>
        </PrivateRoute>
        <PrivateRoute path={"/"} exact>
            <Home/>
        </PrivateRoute>
        <PrivateRoute path={"/welcome"}>
            <WelcomePage/>
        </PrivateRoute>
    </Switch>;
}

export default Routes;


