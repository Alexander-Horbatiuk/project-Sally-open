import React from 'react'
import { Route, Switch } from "react-router-dom";

import MenuBuilder from './Menu-Builder'
import Tables from './Tables'
import Analytics from './Analytics'
import Settings from './Settings'
import Payments from './Payments'
import Navigation from "./Navigation";

const VenueDetails: React.FC = (props) => {
    return (
        <div>
            <Navigation />
            <Switch>
                <Route path={"/venue/:id/menu-builder"} component={MenuBuilder} />
                <Route path={"/venue/:id/tables"} component={Tables} />
                <Route path={"/venue/:id/analytics"} component={Analytics} />
                <Route path={"/venue/:id/settings"} component={Settings} />
                <Route path={"/venue/:id/payments"} component={Payments} />
            </Switch>

            
        </div>
    );
    
}


export default VenueDetails;