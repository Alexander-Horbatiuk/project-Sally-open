import { combineReducers } from 'redux'
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase'
import {firestoreReducer} from 'redux-firestore';

interface IProfile {
    name: string;
    email: string;
    phone: string;
    giftsRevenue: number | undefined;
}

export interface IRootState {
    firebase: FirebaseReducer.Reducer<IProfile>,
    firestore: any,
}

// Add firebase to reducers
export const rootReducer = combineReducers<IRootState>({
    firebase: firebaseReducer,
    firestore: firestoreReducer
});