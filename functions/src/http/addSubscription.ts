import * as functions from "firebase-functions";
import stripe from '../init/stripe';
import * as admin from 'firebase-admin';

const addSubscription = functions.https.onCall(
    async (data, context) => {
        try {
            const { source, customer, name, venueId, tables, country } = data;
            const uid = await context.auth?.uid;

            if (!uid) {
                return;
            }

            const currentPrice: number = country !== 'Cyprus' ? 1499 : tables <= 50 ? 9500 : 12000;

            const price = await stripe.prices.create({
                currency: "EUR",
                unit_amount: currentPrice,
                nickname: name,
                recurring: { interval: "month" },
                product_data: {
                    name, metadata: { venueId }
                }
            });

            const priceGift = await stripe.prices.create({
                currency: "EUR",
                unit_amount: 1,
                nickname: "gifts",
                recurring: { interval: "month", usage_type: "metered" },
                product_data: {
                    name, metadata: { venueId }
                }
            });

            const venueSnapshot = await admin.firestore()
                .collection("venues")
                .doc(venueId)
                .collection("settings")
                .doc("subscription")
                .get();
            const { subscriptionId } = venueSnapshot.data() || {} as any;

            const nextMonth: Date = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return await stripe.subscriptions.create({
                default_source: source,
                metadata: { venueId, uid: context.auth?.uid ?? null },
                customer, items: [{ price: price.id }, { price: priceGift.id }],
                trial_end: subscriptionId ? Math.floor(nextMonth.getTime() / 1000) : undefined
            });
        } catch (error) {
            throw new functions.https.HttpsError('unknown', error.message);
        }
    }
);

export default addSubscription;