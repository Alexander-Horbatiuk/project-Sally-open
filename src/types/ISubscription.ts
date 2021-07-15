import firebase from "firebase";

export default interface ISubscription {
    subscriptionId?: string;
    subscriptionGiftItemId?:string;
    status?: string;
    end?: firebase.firestore.Timestamp;
}