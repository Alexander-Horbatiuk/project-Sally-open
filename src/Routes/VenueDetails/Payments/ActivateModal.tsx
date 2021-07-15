import React from 'react';
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import firebase from '../../../firebase'
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import styles from './ActivateModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Loader from "../../../Components/Loader";
import TextField from '@material-ui/core/TextField';
import Prices from "../../../Components/Prices";
import IVenue from "../../../types/IVenue";
import ISubscription from "../../../types/ISubscription";

interface IProps {
    venue?: IVenue;
    venueId: string;
    subscription: ISubscription;
    handleClose: () => void;
}

function cardSelector(state: any) {
    return state.firestore.data.cards ? state.firestore.data.cards[state.firebase.auth.uid] ?? {} : {};
}

const ActivateModal: React.FC<IProps> = props => {
    const { venueId, venue, subscription, handleClose } = props;
    const { defaultCard = '', ...cards } = useSelector(cardSelector);
    const profile = useSelector((state: any) => state.firebase.profile);
    const [selectedCard, setSelectedCard] = React.useState(defaultCard);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [focus, setFocus] = React.useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const [name, setName] = React.useState('');

    const handleChange = (event) => {
        setSelectedCard(event.target.value);
    };

    const onSubmitModal = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let sourceId = selectedCard;
            if (selectedCard === "addCard") {
                if (!stripe || !elements) {
                    return;
                }

                const cardElement = elements.getElement(CardElement);
                const source = await stripe.createSource(cardElement!, { owner: { name } });

                if (source.error) {
                    setErrorMessage(source.error.message!);
                    return
                } else {
                    const addCard = firebase.functions().httpsCallable('addCard');
                    const result = await addCard({ card: source.source.id });
                    sourceId = result.data.id
                }
            }
            const addSubscription = firebase.functions().httpsCallable('addSubscription');

            await addSubscription({
                source: sourceId,
                customer: profile.customer,
                name: venue!.name,
                venueId,
                tables: venue!.tableCount,
            });
            
            handleClose();

        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={styles.Modal}
            open={venueId !== ""}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={venueId !== ""}>
                <form className={styles.Paper} onSubmit={onSubmitModal}>
                    <h2 className={styles.ModalTitle}>Activate</h2>

                    <div className={styles.Text}>
                        <p>
                            Activate venue "{venue?.name}"?
                        </p>
                    </div>

                    <Prices country={venue?.country ?? ""} selectedIndex={(venue?.tableCount ?? 0) <= 50 ? 0 : 1} hasTrial={!subscription?.status} />

                    <FormControl className={styles.FormControl} fullWidth>
                        <InputLabel id="demo-simple-select-helper-label">Cards</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={selectedCard}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="addCard">Add new card</MenuItem>
                            {isLoaded(cards) && Object.values(cards).map(({ id, card }: any) => <MenuItem
                                key={id}
                                value={id}>
                                **** **** **** {card?.last4}
                            </MenuItem>
                            )}
                        </Select>
                        <FormHelperText>Select a card to activate the venue</FormHelperText>
                        {!!errorMessage && <span className={styles.ErrorSpanFb}>{errorMessage} </span>}
                    </FormControl>

                    {selectedCard === "addCard" &&
                        <div className={styles.BoxCardInput}>
                            <div className={styles.CardBox + ' ' + (focus ? styles.CardBoxFocus : '')}>
                                <CardElement
                                    className={styles.CardEl}
                                    onFocus={() => setFocus(true)}
                                    onBlur={() => setFocus(false)} />
                            </div>
                            <div className="">
                                <TextField
                                    name="name"
                                    label="Name on the card"
                                    type="name"
                                    variant="outlined"
                                    className={styles.SignElForm}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    fullWidth
                                />
                            </div>

                        </div>
                    }

                    <div className={styles.BoxBtnModal}>
                        <Button variant="outlined"
                            className={styles.BtnCancel}
                            onClick={handleClose!}
                            disabled={loading && true}
                        >
                            cancel
                        </Button>

                        <Button variant="contained"
                            color="primary"
                            type="submit"
                            className={styles.BtnActivate}
                            onClick={onSubmitModal}
                            disabled={selectedCard === "" || loading}
                        >
                            activate
                        </Button>
                    </div>
                    {loading && <Loader />}
                </form>
            </Fade>
        </Modal>

    )
};

export default ActivateModal;