import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import StripeAdd from "./Add";
import {stripePromise} from '../../stripe';

const Stripe: React.FC = props => {
    return <Elements stripe={stripePromise}>
            <Switch>
                <Route path={"/stripe/Add/:id"} component={StripeAdd}/>
            </Switch>
        </Elements>
};

export default Stripe;