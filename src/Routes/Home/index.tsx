import React, {useEffect} from 'react';
import HomeView from './View';
import {isLoaded, useFirestore} from "react-redux-firebase";
import {useSelector} from "react-redux";
import Loader from "../../Components/Loader";
import IVenue from "../../types/IVenue";


const Home: React.FC = props => {
    const firestore = useFirestore();

    const {uid, venues, loading} = useSelector((state: any) => {
        const uid = state.firebase.auth.uid;
        const loading = !isLoaded(state.firestore.data.venues)

        return {
            loading,
            uid,
            venues: state.firestore.data.venues as { [id: string]: IVenue },
        }
    });

    useEffect(() => {
        firestore.setListeners([
            {collection: "venues", where: ['adminUser', 'array-contains', uid]}
        ]);
    }, [firestore, uid]);

    if (loading) {
        return <Loader/>;
    }

    return <HomeView venues={venues ?? {}} />;
};

export default Home;