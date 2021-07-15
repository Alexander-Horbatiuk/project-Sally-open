import firebase from "firebase";

export default interface IVenue {
    name: string;
    description: string;
    tags: string[];
    motd: string;
    phone: number;
    phoneFormatted: string;
    currency: string;
    pos: string | undefined;
    tableCount: number;
    tableNumbers: string;
    address: string;
    country: string;
    coverURL: string;
    logoURL: string;
    adminUser: Array<string>;
    createdAt: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}