import * as functions from "firebase-functions";
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const createCustomer = functions.firestore
    .document("admin_users/{uid}")
    .onCreate(async (snapshot, context) => {
        try {
            const {email, name} = snapshot.data() as any;
            const stripe = new Stripe(functions.config().stripe.key,
                {apiVersion: "2020-08-27"});

            const customer = await stripe.customers.create({
                email: email,
                name: name,
            });

            const result = await admin.firestore()
                .collection("admin_users")
                .doc(context.params.uid).set({
                    customer: customer.id,
                }, {merge: true});
            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
            return false;
        }
    });

export default createCustomer;
