import {useHistory} from "react-router-dom";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React, {useState} from "react";
import firebase from "../../../firebase";
import {useSelector} from "react-redux";

const useStripeSubmit = (id: string) => {
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();
    const [selectedCard, setSelectedCard] = useState("addCard")
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const {profile, venue} = useSelector((state: any) => {
        const venue = state.firestore.data.venue_detail;
        return {profile: state.firebase.profile, venue};
    });

    const submit = async (e, inputValueName) => {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorMessage('');
            let sourceId = selectedCard;
            if (selectedCard === "addCard") {
                if (!stripe || !elements) {
                    return;
                }
                const cardElement = elements.getElement(CardElement);
                const source = await stripe.createSource(cardElement!, {owner: {name: inputValueName}});
                if (source.error) {
                    setErrorMessage(source.error.message!);
                    return
                } else {
                    const addCard = firebase.functions().httpsCallable('addCard');
                    const sourceResult = await addCard({card: source.source.id})
                    sourceId = sourceResult.data.id;
                }
            }
            const addSubscription = firebase.functions().httpsCallable('addSubscription');
            
            await addSubscription({
                source: sourceId,
                customer: profile.customer,
                tables: venue.tables,
                name: venue.name,
                venueId: id,
            });
            
            history.push('/');

        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setLoading(false);
        }
    }

    return {loading, submit, errorMessage, selectedCard, setSelectedCard};
}

export default useStripeSubmit;