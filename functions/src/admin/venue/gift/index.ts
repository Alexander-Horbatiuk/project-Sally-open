const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();

exports.get = functions.region("europe-west3").https.onCall(async (data, context) => {
    const { giftID, uid } = data
    // const v_id = context.auth.token["venue-admin"].split("id")[1]

    const giftRef = firestore.collection("users_private/" + uid + "/gifts").doc(giftID)

    const giftData = await giftRef.get().then(doc => doc.data())

    if (!giftData) {
        throw new functions.https.HttpsError("not-found", "Could not find gift")
    }

    // if (giftData.at.v_id !== v_id) {
    //     throw new functions.https.HttpsError("failed-precondition", "Gift is not for this venue", "Gift Venue ID: " + v_id)
    // }

    const lastSatAt = await firestore.collection("users_private").doc(uid).get().then(doc => doc.exists ? doc.data().lastSatAt : null)

    if (lastSatAt) {
        giftData.at.t_id = lastSatAt.t
    }

    await giftRef.delete()

    return giftData
})

exports.send = functions.region("europe-west3").https.onCall(async (data, context) => {
    const payment_data = data.payment_data

    // if (payment_data.at.v_id !== v_id) {
    //     throw new functions.https.HttpsError("failed-precondition", "Venue ID not matching")
    // }

    await firestore.collection("tmp/---payments---/all").add({
        ...payment_data,
        at: {
            ...payment_data.at,
            t_id: data.t_id
        }
    });

    return "success"
})