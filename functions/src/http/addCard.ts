import * as functions from "firebase-functions";
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const addCard = functions.https.onCall(async (data, context) => {
    try {
        const uid = context.auth?.uid;
        if (!uid) {
            return;
        }
        const {customer} = (await admin.firestore()
            .collection("admin_users")
            .doc(uid)
            .get())
            .data() as any;

        const stripe = new Stripe(functions.config().stripe.key,
            {apiVersion: "2020-08-27"});

        const card = await stripe.customers.createSource(
            customer,
            {source: data.card}
        );

        await admin.firestore().collection("cards").doc(uid).set({
            [card.id]: card,
            defaultCard: card.id
        }, {merge: true});

        return card;
    } catch (error) {
        throw new functions.https.HttpsError('unknown', error.message);
    }
});

export default addCard;