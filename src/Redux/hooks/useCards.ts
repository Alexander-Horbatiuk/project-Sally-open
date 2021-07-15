import {isLoaded, useFirestore} from "react-redux-firebase";
import {useEffect} from "react";
import {useSelector} from "react-redux";

const useCards = () => {
    const firestore = useFirestore();
    const {uid, cards: {defaultCard, ...cards}, loading} = useSelector((state: any) => {
        const loading = !isLoaded(state.firestore.data.cards);
        const uid = state.firebase.auth.uid;
        return {
            uid,
            loading,
            cards: (state.firestore.data.cards && (state.firestore.data.cards[uid] ?? {})) || {}
        }
    })

    useEffect(() => {
        if(uid) {
            firestore.setListener({
                collection: "cards", doc: uid
            });
        }
    }, [firestore, uid])

    return {cards, loading};
}

export default useCards;