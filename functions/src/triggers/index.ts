exports.user = require("./user");
exports.venue = require('./venue');

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.database();
const firestore = admin.firestore();

import * as common from "../utils/common";

exports.checkInactiveUsers = functions.region("europe-west3").pubsub.schedule("every 5 minutes").onRun(async () => {
    const allTables = await db.ref('tables').once('value').then(snapshot => snapshot.val())
    const now = new Date().getTime()

    const promises: any = []
    const updates = {}

    if (allTables) {
        Object.keys(allTables).forEach(venue_id => {
            Object.keys(allTables[venue_id]).forEach(table_id => {
                const users = allTables[venue_id][table_id].users
                const tableRef = `tables/${venue_id}/${table_id}/`
                if (users) {
                    Object.keys(users).forEach(uid => {
                        if (now > users[uid].date) {
                            console.log('kick')
                            updates[tableRef + "users/" + uid] = null
                            updates[`tables_public/${venue_id}/${table_id}/${uid}`] = null
                            updates[`locations_public/${uid}`] = null
                        }
                    })
                } else {
                    updates[tableRef + "numUsers"] = null
                    updates[tableRef + "ordered"] = null
                    updates[tableRef + "locked"] = null
                    updates[tableRef + "createdAt"] = null

                    // PROMO
                    updates[tableRef + "promo_sallyWaterBottle"] = null
                }
            })
        })

        if (Object.keys(updates).length > 0) {
            promises.push(db.ref().update(updates))
            await Promise.all(promises)
        }

        return "ok"
    } else {
        return "empty"
    }
})

exports.dailyCleanup = functions.region("europe-west3").pubsub.schedule('30 5 * * *')
    .timeZone('Europe/Athens').onRun(async (context) => {
        const tables = await db.ref("tables").once("value").then(snapshot => snapshot.val())

        const updates = {}

        if (tables) {
            Object.keys(tables).forEach(v => {
                Object.keys(tables[v]).forEach(t => {
                    const table = tables[v][t]
                    const tableRef = `tables/${v}/${t}/`

                    if (table.orders) {
                        updates[tableRef + "orders"] = null
                    }

                    if (table.paid_orders) {
                        updates[tableRef + "paid_orders"] = null
                    }

                    if (table.queued_orders) {
                        updates[tableRef + "queued_orders"] = null
                    }
                })
            })
        }

        if (Object.keys(updates).length > 0) {
            await db.ref().update(updates)
        }

        return null;
    });

exports.onCreateUser = functions.region("europe-west3").auth.user().onCreate(async user => {
    const today = common.getToday()

    if (user.phoneNumber) {
        await Promise.all([
            firestore.collection("users_private").doc(user.uid).set({
                allergens: [],
                type: [],
                phoneNumber: user.phoneNumber,
                visibilityMode: "Public"
            }),
            firestore.collection("users_public").doc(user.uid).set({
                firstname: "user",
                lastname: "",
                username: "user" + common.makeRandomID(5),
                photoURL: "",
                bio: "",
                phoneNumber: user.phoneNumber
            })
        ])
    }

    await firestore.collection("global/stats/dailyNewUsers").doc(today.string)
        .set({ n: admin.firestore.FieldValue.increment(1), date: today.date }, { merge: true })

    return admin.database().ref('userCount').transaction(userCount => (userCount || 0) + 1);
});

exports.onScanPublic = functions.region("europe-west3").database.ref('tables_public/{id}/{t}/{uid}')
    .onCreate(async (snapshot, context) => {
        const user_data = snapshot.val()

        if (user_data) {
            const venueName = await firestore.collection("venues").doc(context.params.id).get().then(doc => doc.data()?.name)

            user_data.id = context.params.id.substring(2);
            user_data.uid = context.params.uid;

            const friends = await db.ref('friendships/' + context.params.uid).once('value').then(snapshot => snapshot.val())

            if (friends) {
                const promises: any = []
                const notificationPromises: any = []

                const body = `${user_data.firstname + " " + user_data.lastname} is now at ` + venueName

                const message = {
                    to: null,
                    sound: 'default',
                    title: '',
                    body: body,
                    data: { path: '/notifications' },
                };

                Object.keys(friends).forEach(uid => {
                    promises.push(db.ref("notifications/" + uid + "/other").push({ data: { user: user_data, body: body }, date: new Date().getTime() * -1 }))
                    promises.push(firestore.collection("users_private").doc(uid).get().then(doc => {
                        if (doc.data()?.ExpoPushToken) {
                            message.to = doc.data()?.ExpoPushToken
                            notificationPromises.push(common.sendPushNotification(message))
                        }
                        return null
                    }))
                })

                await Promise.all(promises)

                if (notificationPromises.length > 0) {
                    await Promise.all(notificationPromises)
                }
            }
        }

        return "ok"
    })

exports.onScan = functions.region("europe-west3").database.ref("tables/{v}/{t}/users/{uid}").onCreate(async (snapshot, context) => {
    const { uid, v, t } = context.params;

    const t_id = t.split("t")[1];

    const userRef = firestore.collection(`venues/${v}/users`).doc(uid);

    await userRef.set({
        scans: admin.firestore.FieldValue.arrayUnion({
            date: new Date(),
            table: t_id
        })
    }, { merge: true });
})

exports.onLeaveTable = functions.region("europe-west3").database.ref("tables/{id}/{t}/users/{uid}").onDelete(async (snapshot, context) => {
    const { uid } = context.params;
    return db.ref("notifications/" + uid + "/gifts").set(null).then(() => "ok")
})

exports.onFriendRequest = functions.region("europe-west3").database.ref("friend-requests/{sender_uid}/{receiver_uid}")
    .onCreate(async (snapshot, context) => {
        const sender_uid = context.params.sender_uid
        const receiver_uid = context.params.receiver_uid

        if (sender_uid && receiver_uid && snapshot.val()) {
            const promises: any = []
            let token;
            let fullname;

            promises.push(firestore.collection("users_private").doc(receiver_uid).get().then(doc => {
                token = doc.data()?.ExpoPushToken
                return null
            }))

            promises.push(firestore.collection("users_public").doc(sender_uid).get().then(doc => {
                fullname = doc.data()?.firstname + " " + doc.data()?.lastname
                return null
            }))

            await Promise.all(promises)

            if (token) {
                const message = {
                    to: token,
                    sound: 'default',
                    title: 'New Friend Request',
                    body: `${fullname} has sent you a friend request`,
                    data: { path: '/notifications' },
                };

                return common.sendPushNotification(message).then(() => "ok").catch(error => console.log(error))
            }
        }

        return "ok"
    })

exports.onGiftRequest = functions.region("europe-west3").database.ref("notifications/{receiver_uid}/gifts/{gift_id}")
    .onCreate(async (snapshot, context) => {
        const receiver_uid = context.params.receiver_uid
        const gift_id = context.params.gift_id
        const gift = snapshot.val()

        if (gift_id && gift) {
            const promises: any = []
            let token;
            let fullname;

            promises.push(firestore.collection("users_private").doc(receiver_uid).get().then(doc => {
                token = doc.data()?.ExpoPushToken
                return null
            }))

            promises.push(firestore.collection("users_public").doc(gift.from.uid).get().then(doc => {
                fullname = doc.data()?.firstname + " " + doc.data()?.lastname
                return null
            }))

            await Promise.all(promises)

            if (token) {
                const message = {
                    to: token,
                    sound: 'default',
                    title: 'New Gift 🎁',
                    body: `${fullname} sent you a gift! Open the app to see it`
                };
                return common.sendPushNotification(message).then(() => "ok").catch(error => console.log(error))
            }
        }
        return "ok"
    })

exports.onNewCard = functions.region("europe-west3").firestore
    .document('users_private/{user_id}/cards/{card_id}')
    .onCreate(async (snap, context) => {
        const data = snap.data();

        if (data.processor === "stripe") {
            return "ok"
        } else {
            const jccFunctions = require('../payments/jcc/functions')

            try {
                await jccFunctions.postFinancialService("ReverseAmount", "0035444017", "GWXum6A7", data.orderID, 1)
            } catch (err) {
                console.log(err)
            }

            return "ok"
        }
    });