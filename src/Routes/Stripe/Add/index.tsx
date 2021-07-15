import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { isLoaded } from "react-redux-firebase";
import { CardElement } from '@stripe/react-stripe-js';
import Button from '@material-ui/core/Button';
import Loader from "../../../Components/Loader";
import styles from './Add.module.scss';
import useStripeSubmit from "./useStripeSubmit";
import TextField from "@material-ui/core/TextField";
import Prices from "../../../Components/Prices";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import useCards from "../../../Redux/hooks/useCards";
import useVenue from "../../../Redux/hooks/useVenue";
import useSubscription from '../../../Redux/hooks/useSubscription';

const StripeAdd: React.FC = props => {
    const { id } = useParams<{ id: string }>();
    const [focus, setFocus] = React.useState(false);
    const { venue, loading: venueLoading } = useVenue(id);
    const { subscription, loading: subscriptionLoading } = useSubscription(id)
    const { loading, submit, errorMessage, selectedCard, setSelectedCard } = useStripeSubmit(id);
    const [inputNameValue, setInputNameValue] = useState('');
    const { cards, loading: cardsLoading } = useCards();

    if (venueLoading || subscriptionLoading || cardsLoading) {
        return <Loader />
    }

    return (
        <div className={styles.CardContainer}>
            <form className={styles.CardForm} onSubmit={(e) => submit(e, inputNameValue)}>
                <h1 className={styles.Title}>Activation</h1>
                <div className={styles.VenueDescription}>
                    <p className={styles.OrderTitle}>
                        <span>Venue: </span>
                        <span className={styles.TextItem}>{venue && venue.name}</span>
                    </p>

                    <p className={styles.OrderAddress}>
                        <span>Tables: </span>
                        <span className={styles.TextItem}>{venue && venue.tableCount}</span>
                    </p>
                </div>

                <Prices country={venue.country} selectedIndex={venue.tableCount <= 50 ? 0 : 1} hasTrial={!subscription.subscriptionId} />

                {cards && renderCardSelection()}

                {selectedCard === "addCard" && renderNewCard()}

                {!!errorMessage && <span className={styles.ErrorSpanFb}>{errorMessage} </span>}
                <div className={styles.ActionBox}>
                    <Button
                        component={Link}
                        to={"/"}
                        variant="outlined"
                        type="button"
                        size={"large"}
                        disabled={loading}>
                        cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size={"large"}
                        disabled={loading}>
                        Activate
                    </Button>

                </div>
            </form>
            {loading && <Loader />}
        </div>
    )

    function renderNewCard() {
        return <>
            <div className={styles.CardBox + ' ' + (focus ? styles.CardBoxFocus : '')}>
                <CardElement
                    className={styles.CardEl}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
            </div>

            <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                style={{ marginBottom: '15px' }}
                onChange={e => setInputNameValue(e.target.value)}
            />
        </>
    }

    function renderCardSelection() {
        return <FormControl className={styles.FormControl} fullWidth>
            <InputLabel id="demo-simple-select-helper-label">Cards</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value as string)}
            >
                <MenuItem value="addCard">Add new card</MenuItem>
                {isLoaded(cards) && Object.values(cards).map(({ id, card }: any) => <MenuItem
                    key={id}
                    value={id}>
                    **** **** **** {card?.last4}
                </MenuItem>
                )}
            </Select>
            <FormHelperText>Select a card to activate the venue</FormHelperText>
        </FormControl>
    }
};

export default StripeAdd;