import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.database();
// const firestore = admin.firestore();

import fetch from "node-fetch";

function uploadFile(localPath, destinationPath, type, token) { // RETURNS IMAGE URL
    const bucket = admin.storage().bucket()

    return bucket.upload(localPath, {
        destination: destinationPath,
        metadata: {
            contentType: type,
            metadata: {
                firebaseStorageDownloadTokens: token
            }
        }
    }).then(() => {
        const uri = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(destinationPath) + "?alt=media&token=" + token;
        return uri;
    }).catch(err => {
        console.log(err);
        throw new functions.https.HttpsError("internal", err.message, err.details)
    })
}

async function getUser(uid) {
    const algoliasearch = require("algoliasearch");
    const client = algoliasearch("2OAWAKA5R8", "e65c9249fe0615368fdf295c80fa2e3b");
    const index = client.initIndex("users");

    const data = await index.getObject(uid)

    return { ...data, uid: uid }
}

const sendPushNotification = async (message) => {
    // const message = {
    //     to: expoPushToken,
    //     sound: 'default',
    //     title: 'Original Title!',
    //     body: 'And here is the body!',
    //     data: { data: 'goes here' },
    // };

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    });
    console.log(await res.json())
    return "success";
}

const addOrderConfirm = async (order_data, queue_data, menu) => {
    const refId = db.ref().push().getKey()
    const server_date = admin.database.ServerValue.TIMESTAMP;

    let updates = {}

    if (order_data.t_id && menu) {
        const tableRef = `tables/id${order_data.v_id}/t${order_data.t_id}`
        const displayQueueUpdates = getQueuedOrderDisplayItems({ ...order_data, ...queue_data }, menu, tableRef)
        updates = displayQueueUpdates

        await db.ref().update(updates)
    }

    return db.ref(`orders/confirmation/sally/id${order_data.v_id}`).push({
        ...order_data,
        orders: queue_data.uid ? {
            [refId]: queue_data
        } : queue_data,
        date: server_date
    }).then(() => "success")
}

const addOrderToQueue = async (order_data, venue_data, venue_menu) => {
    const server_date = admin.database.ServerValue.TIMESTAMP;

    const p = []

    const queue_data = {
        uid: order_data.uid,
        username: order_data.username,
        cart: order_data.cart,
        total: order_data.total,
        confirmation_required: order_data.total > venue_data.confirmOrderMinTotal,
        date: server_date,
        promo_sallyWaterBottle: order_data.promo_sallyWaterBottle
    }

    const queueRef = `orders/queue/${venue_data.pos}/id${venue_data.id}/t${order_data.t_id}`
    const tableRef = `tables/id${venue_data.id}/t${order_data.t_id}`
    let updates = {}
    const order_id = db.ref(queueRef + "/orders").push().getKey()

    updates[queueRef + "/orders/" + order_id] = queue_data
    updates[queueRef + "/ip"] = venue_data.ip

    const displayQueueUpdates = getQueuedOrderDisplayItems(order_data, venue_menu, tableRef)

    updates = { ...updates, ...displayQueueUpdates }

    p.push(db.ref().update(updates))
    p.push(db.ref(queueRef + "/date").once("value").then(snapshot => {
        if (snapshot.val()) {
            return null
        } else {
            // set the date of queue created
            return db.ref(queueRef + "/date").set(server_date)
        }
    }))

    return Promise.all(p).then(() => "success")
}

const calculateCartTotal = (menu, cart) => {
    let total = 0

    for (let i = 0; i < cart.length; i++) {
        const { categoryNumber, itemNumber, section, quantity } = cart[i];

        const itemRef = menu[section][categoryNumber].itemsarray[itemNumber];

        total = total + calculateItemFullPrice(cart[i], itemRef) * quantity;
    }

    return total;
}

function calculateItemFullPrice(cart_item, menu_item) {
    let price = Number(menu_item.price);

    if (cart_item.options) {
        for (let j = 0; j < cart_item.options.length; j++) {
            if (Array.isArray(cart_item.options[j].indexes)) {
                for (let k = 0; k < cart_item.options[j].indexes.length; k++) {
                    if (menu_item.options[j].price[cart_item.options[j].indexes[k]] !== "" && menu_item.options[j].price[cart_item.options[j].indexes[k]]) {
                        price = price + Number(menu_item.options[j].price[cart_item.options[j].indexes[k]])
                    }
                }
            } else if (cart_item.options[j].indexes !== -1) {
                if (menu_item.options[j]) {
                    if (menu_item.options[j].price[cart_item.options[j].indexes] !== "" && menu_item.options[j].price[cart_item.options[j].indexes]) {
                        price = price + Number(menu_item.options[j].price[cart_item.options[j].indexes])
                    }
                }
            }
        }
    }

    return price;
}

function getQueuedOrderDisplayItems(order_data, menu, tableRef) {
    // add queued order to table so user can see it has been sent when viewing tab but is awaiting confirmation
    const generateDisplayItems = require('../order/sally/functions').generateDisplayItems

    const items = generateDisplayItems(menu, order_data.cart)

    const ref = tableRef + "/queued_orders/" + order_data.uid

    const updates = {}

    Object.keys(items).forEach(entryID => {
        updates[ref + "/items/" + entryID] = items[entryID]
    })
    updates[ref + "/user/uid"] = order_data.uid
    updates[ref + "/user/username"] = order_data.username

    return updates
}

async function kickUsers(v_id, t_id, users) {
    const tableRef = `tables/id${v_id}/t${t_id}/users/`
    const tablePublicRef = `tables_public/id${v_id}/t${t_id}/`
    const locationPublicRef = `locations_public/`

    if (!Array.isArray(users)) {
        console.log("Kick Users error, users not an array")
        return;
    }

    const updates = {}

    users.forEach(uid => {
        updates[tableRef + uid] = null
        updates[tablePublicRef + uid] = null
        updates[locationPublicRef + uid] = null
    })

    await db.ref().update(updates)
}

function getToday() {
    const date = new Date()

    date.setHours(23, 59, 59)

    const today_str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

    return { date: date, string: today_str }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function makeRandomID(length) {
    const result = [];
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

export {
    uploadFile,
    getUser,
    sendPushNotification,
    addOrderConfirm,
    addOrderToQueue,
    calculateCartTotal,
    calculateItemFullPrice,
    getToday,
    addMinutes,
    kickUsers,
    makeRandomID
}