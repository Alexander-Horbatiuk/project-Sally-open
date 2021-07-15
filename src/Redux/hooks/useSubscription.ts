import {isLoaded, useFirestore} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import ISubscription from "../../types/ISubscription";

const useSubscription = (id: string) => {
    const firestore = useFirestore();
    const {uid, subscription, loading} = useSelector((state: any) => {
        const uid = state.firebase.auth.uid;
        const loading = !isLoaded(state.firestore.data?.subscription);
        const subscription = state.firestore.data.subscription || {};

        console.log(state.firestore.data)
        return {
            uid,
            subscription,
            loading
        }
    });

    useEffect(() => {
        if (uid) {
            firestore.setListener({
                collection: `venues/${id}/settings`,
                doc: "subscription",
                storeAs: "subscription"
            });
        }
    }, [firestore, id, uid]);

    return {subscription: subscription as ISubscription, loading};
}

export default useSubscription;