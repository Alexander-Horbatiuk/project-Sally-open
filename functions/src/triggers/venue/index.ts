import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const firestore = admin.firestore();

import { createTables } from "../../utils/createTables";

exports.onCreate = functions.region("europe-west3")
    .firestore.document("venues/{v_id}")
    .onCreate(async (snapshot, context) => {
        const v_id = context.params.v_id.split("id")[1];

        const { tableNumbers } = snapshot.data();

        await createTables(v_id, tableNumbers);

        await firestore.collection("venues").doc(context.params.v_id)
            .update({ tableNumbers: admin.firestore.FieldValue.delete() });

        return "ok";
    })