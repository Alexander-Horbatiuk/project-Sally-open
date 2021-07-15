import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// const db = admin.database();
const firestore = admin.firestore();

const cors = require("cors")({ origin: true })

import * as common from "../../../utils/common";

// MENU

exports.get = functions.region("europe-west3").https.onCall((data) => {
    const { v_id, lang } = data

    return firestore.collection(`venues/id${v_id}/menus`).doc(lang).get().then(snapshot => {
        return snapshot.data()
    })
})

// exports.getWithToken = functions.region('europe-west3').https.onCall((data) => {
//     return admin.auth().verifyIdToken(data.token).then((decodedToken) => {
//         let v_id = decodedToken["venue-admin"].split("id")[1]
//         return v_id
//     }).catch((err) => {
//         return err
//     })
// })

exports.save = functions.region("europe-west3").https.onCall(async (data) => {
    const { v_id, menu, lang } = data

    if (!lang) {
        throw new functions.https.HttpsError("failed-precondition", "No language provided")
    }

    await firestore.collection(`venues/${v_id}/menus`).doc(lang).set(menu).catch((error) => {
        console.log(error)
        throw new functions.https.HttpsError("internal", error.message, error.details)
    })

    return "success"
})

/* eslint-disable */

exports.uploadImage = functions.region('europe-west3').https.onRequest((req, res) => {
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const Busboy = require('busboy');
    const { v4: uuidv4 } = require("uuid")

    let uuid = uuidv4()

    if (req.method !== 'POST') {
        // Return a "method not allowed" error
        return res.status(405).end();
    }
    const busboy = new Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
        // TODO(developer): Process submitted field values here
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    const fileWrites = [];

    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', async () => {
        await Promise.all(fileWrites);
        for (const file in uploads) {
            let uri = await common.uploadFile(uploads[file], "venues/" + fields["v_id"] + "/" + file, 'image/png', uuid)
            res.status(200).send(uri);
            return fs.unlinkSync(uploads[file]);
        }
    });

    busboy.end(req.rawBody);
});