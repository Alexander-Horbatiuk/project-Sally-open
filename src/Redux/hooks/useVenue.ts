import {isLoaded, useFirestore} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import IVenue from "../../types/IVenue";

const useVenue = (id: string) => {
    const firestore = useFirestore();
    const {uid, venue, loading} = useSelector((state: any) => {
        const uid = state.firebase.auth.uid;
        const loading = !isLoaded(state.firestore.data?.venue_detail);
        const venue = state.firestore.data.venue_detail;
        return {
            uid,
            venue,
            loading
        }
    });

    useEffect(() => {
        if (uid) {
            firestore.setListener({
                collection: "venues",
                doc: id,
                storeAs: "venue_detail"
            });
        }
    }, [firestore, id, uid]);

    return {venue: venue as IVenue, loading};
}

export default useVenue;