import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const firestore = admin.firestore();

exports.likeMessage = functions.region("europe-west3").https.onCall(async (data) => {
    await firestore.collection(data.ref).doc(data.id).update({
        likes: admin.firestore.FieldValue.arrayUnion(data.user)
    })

    return "success"
})

exports.unlikeMessage = functions.region("europe-west3").https.onCall(async (data) => {
    await firestore.collection(data.ref).doc(data.id).update({
        likes: admin.firestore.FieldValue.arrayRemove(data.user)
    })

    return "success"
})