import React from 'react';
import {Provider} from 'react-redux';
import {compose, createStore} from 'redux';
import {rootReducer} from "./rootReducer";
import {ReactReduxFirebaseProvider} from 'react-redux-firebase';
import firebase from '../firebase';
import {createFirestoreInstance} from 'redux-firestore';

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'admin_users',
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    // enableClaims: true // Get custom claims along with the profile
}

// Create store with reducers and initial state
const initialState = {};
const store = createStore(rootReducer, initialState, compose(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
));


const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
}

const ReduxProvider: React.FC = props => {
    return <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            {props.children}
        </ReactReduxFirebaseProvider>
    </Provider>
}

export default ReduxProvider;