exports.menu = require("./menu");
exports.tables = require("./tables");
exports.gift = require("./gift");
exports.control = require("./control");

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { makeRandomID } from "../../utils/common";

const firestore = admin.firestore();
const storage = admin.storage();

exports.add = functions.region("europe-west3").https.onCall(async (data) => {
    if (!data) {
        throw new functions.https.HttpsError("failed-precondition", "No data provided");
    }

    const v_id = makeRandomID(5);

    const id = "id" + v_id;

    const [coverURL, logoURL] = await Promise.all([getFileURL(data.coverImgRef), getFileURL(data.logoImgRef)])

    await firestore.collection("venues").doc(id).set({
        ...data,
        createdAt: new Date(),
        id: v_id,
        motd: "",
        tags: [],
        coverImgRef: undefined,
        logoImgRef: undefined,
        coverURL: coverURL ? coverURL : undefined,
        logoURL: logoURL ? logoURL : undefined
    });

    return id;

    async function getFileURL(ref: string) {
        if (ref) {
            const fileRef = storage.bucket().file(ref)
            const exists = await fileRef.exists()

            if (exists) {
                const url = fileRef.getSignedUrl({
                    action: "read",
                    expires: '03-09-2491'
                }).then(signedUrls => signedUrls[0])

                return url
            }
        }

        return null
    }
});