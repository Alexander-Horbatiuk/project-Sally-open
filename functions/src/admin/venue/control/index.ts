import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.database();

exports.kickUser = functions.region("europe-west3").https.onCall(data => {
    const updates = {}

    updates[`tables/id${data.v_id}/t${data.t_id}/users/${data.uid}`] = null
    updates[`tables_public/id${data.v_id}/t${data.t_id}/${data.uid}`] = null
    updates[`locations_public/${data.uid}`] = null

    return db.ref().update(updates).then(() => "success")
})

exports.kickAllUsers = functions.region("europe-west3").https.onCall(async data => {
    const ref = `tables/id${data.v_id}/t${data.t_id}/users`
    const users = await db.ref(ref).once("value").then(snapshot => snapshot.val())

    const updates = {}

    Object.keys(users).forEach(uid => {
        updates[ref + "/" + uid] = null
        updates[`tables_public/id${data.v_id}/t${data.t_id}/${uid}`] = null
        updates[`locations_public/${uid}`] = null
    })

    return db.ref().update(updates).then(() => "success")
})