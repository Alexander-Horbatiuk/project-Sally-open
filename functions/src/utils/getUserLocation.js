import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const db = admin.database();
const firestore = admin.firestore();

module.exports = async function getUserLocation(uid, user_uid) {
    const userFriendshipsRef = db.ref("friendships/" + uid)
    const friendships = await userFriendshipsRef.once("value").then(snapshot => snapshot.val() || {})

    const publicLocationRef = db.ref("locations_public/" + user_uid)
    const location = await publicLocationRef.once("value").then(snapshot => snapshot.val())

    const visibilityMode = await firestore.collection("users_private").doc(user_uid).get().then((doc) => doc.data().visibilityMode)

    if (location && visibilityMode !== "Ghost") {
        return db.ref('tables_public/id' + location.id + '/t' + location.t_id).once('value').then(snapshot => {
            const users = snapshot.val();

            let temp;

            if (users && user_uid in users) {
                temp = {
                    id: location.id,
                    t: location.t_id,
                    venue_name: location.venue_name,
                    users: {}
                }

                Object.keys(users).forEach(user => {
                    if (user !== user_uid && ((!users[user].fo && visibilityMode === "Public") || friendships[user])) {
                        temp.users[user] = users[user]
                    }
                })
            }

            return temp;
        }).catch(error => {
            console.log(error)
            throw new functions.https.HttpsError("internal", error.message, error.details)
        })
    }

    return null;
}