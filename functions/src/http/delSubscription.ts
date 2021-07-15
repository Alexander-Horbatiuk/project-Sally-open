import * as functions from "firebase-functions";
import stripe from "../init/stripe";
import * as admin from "firebase-admin";

const delSubscription = functions.https.onCall(async (data, context) => {
    try {
        const uid = context.auth?.uid;
        if (!uid) {
            return;
        }
        const {venueId} = data;
        const snapshot = await admin.firestore()
            .collection("venues")
            .doc(venueId)
            .collection("settings")
            .doc("subscription")
            .get();

        return await stripe
            .subscriptions
            .del(
                (snapshot.data() as any).subscriptionId
            );
    } catch (error) {
        throw new functions.https.HttpsError('unknown', error.message);
    }
});

export default delSubscription;