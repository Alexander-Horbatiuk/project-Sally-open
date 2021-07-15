import React from 'react';
import styles from './View.module.scss';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FirebaseImg from "../../Components/FirebaseImg";
import Typography from "@material-ui/core/Typography";
import LinearProgress from '@material-ui/core/LinearProgress';

import IVenue from "../../types/IVenue";
import ISubscription from '../../types/ISubscription';

import { firestore } from "../../firebase";

interface IProps {
    venues?: { [id: string]: IVenue };
}

const HomeView: React.FC<IProps> = props => {
    const { venues = {} } = props;

    return (
        <div className={styles.Container}>
            <Typography variant={"h5"}>
                <div>
                    Venues
                </div>
            </Typography>
            <div className={styles.BoxContent}>
                {Object.keys(venues)
                    .sort((a, b) => new Date(venues[a].createdAt.seconds * 1000).getTime() - new Date(venues[b].createdAt.seconds).getTime())
                    .map((id: string) => <VenueCard key={"vcard" + id} id={id} />)}
                <Link className={styles.CardAdd} to="/venue/add">
                    <AddCircleOutlineIcon style={{ width: "2em", height: "2em" }} />
                    <p className={styles.TitleCardAdd}>
                        Add Venue
                    </p>
                </Link>
            </div>
        </div>
    )

    function VenueCard({ id }) {
        const item = venues[id];

        const [subscription, setSubscription] = React.useState<ISubscription | null>(null)
        const [subscriptionLoading, setSubscriptionLoading] = React.useState(true)

        React.useEffect(() => {
            getSubscription()

            async function getSubscription() {
                const subscriptionSnapshot = await firestore.collection(`venues/${id}/settings`).doc("subscription").get()

                setSubscription(subscriptionSnapshot.data() || null)
                setSubscriptionLoading(false)
            }
        }, [id])

        return (<Link className={styles.Card} key={id} to={`/venue/${id}`}>
            <FirebaseImg src={item.coverURL} className={styles.ImgCard} />
            <p className={styles.TitleCard}>{item.name}</p>
            {subscriptionLoading ? <div style={{ width: "100%" }}>
                <LinearProgress />
            </div>
                : subscription ? <>
                    <p className={styles.StatusCard}>
                        Status: <span>{subscription?.status}</span>
                        {subscription?.status === "canceled" && <><br />Active till <span>{getDateStr(subscription?.end)}</span></>}
                        {subscription?.status === "trialing" && <><br />Trial ends <span>{getDateStr(subscription?.end)}</span></>}
                    </p>
                </> : null}
        </Link>
        );

        function getDateStr(subscriptionEnd) {
            return subscriptionEnd?.toDate()
                ?.toLocaleDateString(window.navigator.language.slice(0, 2), {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                });
        }
    }
};

export default HomeView;