import React from "react";
import {Switch, Route} from "react-router-dom";

import VenueAdd from "./Add";

const Venue: React.FC = props=> {
    return <Switch>
        <Route path={"/venue/Add"} component={VenueAdd} />
    </Switch>
};

export default Venue;