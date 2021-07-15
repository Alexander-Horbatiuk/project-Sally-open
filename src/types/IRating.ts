import firebase from "firebase";

export default interface IRating {
    date: firebase.firestore.Timestamp,
    comment: string,
    stars: number,
    id: string
  }