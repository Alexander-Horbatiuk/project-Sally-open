import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// const db = admin.database();
const firestore = admin.firestore();

import fetch from "node-fetch";
import * as common from "../../../utils/common";

// TABLES

exports.get = functions.region("europe-west3").https.onCall(async data => {
    let id = data.id;

    id = id.split("id")[1];

    const snapshot = await firestore.collection("qr_codes").where("id", "==", id).get()

    if (snapshot.empty) {
        return
    }

    return snapshot.docs.map(doc => {
        return { _id: doc.id, ...doc.data() }
    });
})

exports.new = functions.region("europe-west3").https.onCall(async (data) => {
    const v_id = data.v_id.split("id")[1]
    const { tableIds } = data;

    const { createTables } = require("../../../utils/createTables");

    return createTables(v_id, tableIds)
});

exports.save = functions.region("europe-west3").https.onCall(async data => {
    return firestore.collection("qr_codes").doc(data.id).update({ t: data.t_id, type: data.type })
        .then(() => {
            return "success";
        })
        .catch(error => {
            console.log(error);
            return error.message;
        })
})

exports.delete = functions.region("europe-west3").https.onCall(async data => {
    return firestore.collection("qr_codes").doc(data.id).delete()
        .then(() => "success")
        .catch(error => {
            console.log(error);
            return error.message;
        })
})

exports.getQRCode = functions.region("europe-west3").https.onCall(async (data) => {
    const fs = require("fs");
    const { v4: uuidv4 } = require("uuid");
    const uuid = uuidv4();

    const v_id = data.v_id.split("id")[1]

    const table_data = await firestore.collection("qr_codes").doc(data.id).get().then(doc => doc.data())

    const numSVG = getTableNumSVG(table_data.t.toString())

    const numSVGref = admin.storage().bucket().file("media/QRCodeNums/svg/" + table_data.t + ".svg")

    const exists = await numSVGref.exists().then(res => res[0])

    let numSVG_url;

    if (exists) {
        numSVG_url = await numSVGref.getSignedUrl({
            action: "read",
            expires: '03-20-2025',
            content_type: 'image/svg+xml'
        }).then((signedUrls) => {
            console.log(signedUrls)
            return signedUrls[0]
        }).catch((err) => {
            console.log(err)
            return null
        })
    } else {
        console.log('creating new image')
        const temp_numSVG_path = "/tmp/" + uuid + ".svg"

        const writeFile = await new Promise((resolve, reject) => {
            fs.writeFile(temp_numSVG_path, numSVG, (err) => {
                if (err) {
                    console.log(err.code)
                    reject(err)
                } else {
                    resolve("success")
                }
            })
        })

        await writeFile

        numSVG_url = await common.uploadFile(temp_numSVG_path, "media/QRCodeNums/svg/" + table_data.t + ".svg", 'image/svg+xml', uuid)
    }

    const body = JSON.stringify({
        data: "https://conn.sally.app/" + data.id,
        config: {
            body: "circular",
            eye: "frame13",
            eyeBall: "ball15",
            erf1: [],
            erf2: [],
            erf3: [],
            brf1: [],
            brf2: [],
            brf3: [],
            bodyColor: "#000000",
            eye1Color: "#000000",
            eye2Color: "#000000",
            eye3Color: "#000000",
            eyeBall1Color: "#000000",
            eyeBall2Color: "#000000",
            eyeBall3Color: "#000000",
            logo: numSVG_url + "&.svg",
            logoMode: "clean"
        },
        size: 200,
        download: false,
        file: "svg"
    })

    return fetch("https://qrcode-monkey.p.rapidapi.com/qr/custom", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-rapidapi-key": "5a7b821fd7msh3c45142d0ea6d71p1df78fjsn0514f1632632",
            "x-rapidapi-host": "qrcode-monkey.p.rapidapi.com",
            "useQueryString": false
        },
        body: body
    })
        .then(async res => {
            function streamToString(stream) {
                const chunks = [];
                return new Promise((resolve, reject) => {
                    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                    stream.on('error', (err) => reject(err));
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                })
            }

            const binary = await streamToString(res.body)

            const temp_path = "/tmp/" + data.id

            const writeFile = await new Promise((resolve, reject) => {
                fs.writeFile(temp_path, binary, (err) => {
                    if (err) {
                        console.log(err.code)
                        reject(err)
                    } else {
                        resolve("success")
                    }
                })
            })

            await writeFile

            const filepath = `venues/id${v_id}/qr_codes/` + data.id + ".svg"

            return common.uploadFile(temp_path, filepath, 'image/svg+xml', uuid)
        }).catch(err => {
            console.log(err);
        })

    function getTableNumSVG(number) {
        const length = number.length
        let svg = ""

        switch (length) {
            case 1:
                svg = `<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_1">
                 <title>Layer 1</title>
                 <text transform="matrix(1,0,0,1,0,0) " style="cursor: move;" font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Amaranth" font-size="38" id="svg_1" y="48.15467" x="24.43615" opacity="undefined" stroke-width="0" stroke="#ed4d1c" fill="#ed4d1c">${number}</text>
                </g>
               </svg>`
                break;
            case 2:
                svg = `<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_1">
                 <title>Layer 1</title>
                 <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Amaranth" font-size="38" id="svg_1" y="48.15263" x="13.86074" opacity="undefined" stroke-width="0" stroke="#ed4d1c" fill="#ed4d1c">${number}</text>
                </g>
               </svg>`
                break;
            case 3:
                svg = `<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_1">
                 <title>Layer 1</title>
                 <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Amaranth" font-size="23" id="svg_1" y="40.32654" x="15.81625" opacity="undefined" stroke-width="0" stroke="#ed4d1c" fill="#ed4d1c">${number}</text>
                </g>
               </svg>`
                break;
        }

        return svg
    }
})