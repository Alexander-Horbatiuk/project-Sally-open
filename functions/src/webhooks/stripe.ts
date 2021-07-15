import * as functions from 'firebase-functions';
import stripe from '../init/stripe';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripeWebhook = functions.https.onRequest(async (req, resp) => {
    try {
        const event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.header('stripe-signature') ?? "",
            functions.config().stripe.webhook
        );

        const object = event.data.object as any;
        let subscription: Stripe.Subscription;
        let subscriptionItem: Stripe.SubscriptionItem | null;
        let intent: Stripe.PaymentIntent;
        let venueId: string;
        let uid: string;
        let expirationTime: Date;

        switch (event.type) {
            case "customer.subscription.created":
                subscription = object as Stripe.Subscription;
                subscriptionItem = subscription.items.data
                    .find((item) =>
                        item.price.recurring!.usage_type === "metered") || null;
                functions.logger.log(subscription);

                venueId = subscription.metadata.venueId;
                uid = subscription.metadata.uid;
                expirationTime = new Date(subscription.current_period_end * 1000);

                await admin.firestore()
                    .collection("venues")
                    .doc(venueId)
                    .collection("settings")
                    .doc("subscription")
                    .set({
                        subscriptionId: subscription.id,
                        subscriptionGiftItemId: subscriptionItem?.id
                    }, {merge: true});

                await saveStatus(
                    venueId,
                    uid,
                    subscription.status,
                    expirationTime
                );

                break;
            case "customer.subscription.updated":
                subscription = object as Stripe.Subscription;
                functions.logger.log(subscription);

                venueId = subscription.metadata.venueId;
                uid = subscription.metadata.uid;
                expirationTime = new Date(subscription.current_period_end * 1000);

                await saveStatus(
                    venueId,
                    uid,
                    subscription.status,
                    expirationTime
                );

                break;
            case "customer.subscription.deleted":
                subscription = object as Stripe.Subscription;
                functions.logger.log(subscription);

                venueId = subscription.metadata.venueId;
                uid = subscription.metadata.uid;
                expirationTime = new Date(subscription.current_period_end * 1000);
                await saveStatus(
                    venueId,
                    uid,
                    subscription.status,
                    expirationTime
                );

                break;
            case "payment_intent.succeeded":
                intent = object as Stripe.PaymentIntent;
                functions.logger.log(intent);
                // intent.status === 'succeeded'
                break;
            default:
                functions.logger.log(object);
        }
        resp.sendStatus(200);
    } catch (error) {
        functions.logger.error(error);
        resp.sendStatus(500);
    }
});

async function saveStatus(
    venueId: string, uid: string, status: string, date: Date
) {
    await admin.firestore()
        .collection('venues')
        .doc(venueId)
        .collection("settings")
        .doc("subscription")
        .set({
            status: status,
            end: date
        }, {merge: true});
}

export default stripeWebhook;
