import Stripe from "stripe";
import * as functions from "firebase-functions";

const stripe = new Stripe(functions.config().stripe.key,
    {apiVersion: "2020-08-27"});

export default stripe;