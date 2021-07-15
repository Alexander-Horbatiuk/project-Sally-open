import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions'
import 'firebase/storage';

import fbConfig from './fbConfig.json';

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(fbConfig) : firebase.app()

const auth = firebaseApp.auth();
const db = firebaseApp.database();
const firestore = firebaseApp.firestore();
const functions = firebaseApp.functions("europe-west3");
const storage = firebaseApp.storage();

export { auth, db, firestore, functions, storage }

export default firebase;