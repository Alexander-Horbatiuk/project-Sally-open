import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const firestore = admin.firestore()

import fetch from "node-fetch";

const wait = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(null), ms));
}

interface ITable {
    _id: string; // table document ID
    code: string; // table code
    id: string; // venue ID
    t: string | number; // table ID
    type: "table-service" | "table-service-pi" | "self-service" | undefined;
}

export async function createTables(v_id, tableIds) {
    if (tableIds && tableIds.length > 0) {
        tableIds = tableIds.replace(/\s/g, '');

        const tableNumbersArray: Array<string> = tableIds.split(",")

        if (tableNumbersArray.length > 0) {
            const promises: any = [];
            let temp: any = []

            for (let i = 0; i < tableNumbersArray.length; i++) {
                const t_id = tableNumbersArray[i]

                if (t_id) {
                    temp.push(createTable(v_id, t_id))

                    if ((i && (i % 5 === 0)) || i === tableNumbersArray.length - 1) {
                        temp.push(wait(1000))
                        promises.push(temp)
                        temp = []
                    }
                }
            }

            let res: any = []

            for (let k = 0; k < promises.length; k++) {
                const subPromises = promises[k];

                let promisesResponse: Array<ITable | null> = await Promise.all(subPromises);

                promisesResponse = promisesResponse.filter(el => el != null)

                res = [...res, ...promisesResponse]
            }

            return res
        }
    }

    return []
}

export function createTable(v_id, t_id) {
    const url_code = firestore.collection("qr_codes").doc().id;

    return fetch("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyB0GPW90Z06gzzDcZy1YsWqtlxGHcX6HKU",
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                dynamicLinkInfo: {
                    "domainUriPrefix": "https://conn.sally.app",
                    "link": "https://sally.app/?code=" + url_code,
                },
                suffix: {
                    "option": "UNGUESSABLE"
                }
            })
        })
        .then((json) => json.json())
        .then((res) => {
            if (res.shortLink) {
                const shortLinkCode = res.shortLink.split("/").pop();
                const obj = { id: v_id, t: t_id, code: url_code };
                return firestore.collection("qr_codes").doc(shortLinkCode).set(obj)
                    .then(() => ({ _id: shortLinkCode, ...obj }));
            } else {
                console.error(res);
                throw new functions.https.HttpsError("internal", "API Request Failed");
            }
        });
}