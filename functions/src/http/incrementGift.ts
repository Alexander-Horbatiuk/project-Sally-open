import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import stripe from '../init/stripe';

const incrementGift = functions.https.onRequest(async (req, resp) => {
    try {
        const {uid, venueId, quantity = 1} = req.body;

        if (!uid) {
            resp.status(500).send({message: "uid not set"});
            return;
        }
        if (!venueId) {
            resp.status(500).send({message: "venueId not set"});
            return;
        }

        const snapshot = await admin.firestore()
            .collection("venues")
            .doc(venueId)
            .collection("settings")
            .doc("subscription").get();

        const {subscriptionGiftItemId} = snapshot.data() as any;

        const usage = await stripe
            .subscriptionItems
            .createUsageRecord(subscriptionGiftItemId, {
                action: "increment",
                quantity: Number.parseInt(quantity),
                timestamp: Math.floor(new Date().getTime() / 1000)
            });
        resp.status(200).send(usage);
    } catch (e) {
        resp.status(500).send(e);
    }
});

export default incrementGift;