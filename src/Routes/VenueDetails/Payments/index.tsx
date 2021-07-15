import React from 'react';
import Loader from "../../../Components/Loader";

import styles from './Payments.module.scss'
import { useParams } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../stripe";
import ActivateModal from "./ActivateModal";
import ModalDisable from "./DisableModal";
import Button from "@material-ui/core/Button";
import useVenue from '../../../Redux/hooks/useVenue';
import useSubscription from '../../../Redux/hooks/useSubscription';
import useCards from '../../../Redux/hooks/useCards';

const Payments: React.FC = (props) => {
  const { id } = useParams<{ id: string }>();
  const { venue, loading: venueLoading } = useVenue(id);
  const { subscription, loading: subscriptionLoading } = useSubscription(id);
  const { loading: cardsLoading } = useCards();

  const [indexActivate, setIndexActivate] = React.useState('');
  const [indexDisable, setIndexDisable] = React.useState('');

  if (venueLoading || subscriptionLoading || cardsLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.BoxContent}>
        {renderCard(id)}

        <Elements stripe={stripePromise}>
          <ActivateModal
            venue={venue}
            subscription={subscription}
            handleClose={() => setIndexActivate('')}
            venueId={indexActivate}
          />
        </Elements>

        <ModalDisable
          id={indexDisable}
          venue={venue}
          handleClose={() => setIndexDisable('')}
        />
      </div>
    </>
  );

  function renderCard(id: string) {
    const { status: subscriptionStatus = 'unset', end: subscriptionEnd } = subscription;

    return (
      <div key={id} className={styles.StatusCardBox}>
        <span>
          Status: <b>{subscriptionStatus}</b>
        </span>
        {!!subscriptionEnd &&
          (subscriptionStatus === 'canceled' ?
            <span>Active till: <b>{getDateStr()}</b></span>
            : <span>Trial ends: <b>{getDateStr()}</b></span>)}
        {subscriptionStatus === "active" || subscriptionStatus === "trialing" ?
          <Button
            className={styles.Btn}
            variant="contained"
            color={"secondary"}
            onClick={() => setIndexDisable(id)}
          >
            disable
          </Button>
          :
          <Button
            variant="contained"
            color="primary"
            className={styles.Btn}
            onClick={() => setIndexActivate(id)}
          >
            activate
          </Button>
        }
      </div>
    );

    function getDateStr() {
      return subscriptionEnd?.toDate()
        ?.toLocaleDateString(window.navigator.language.slice(0, 2), {
          month: "short",
          year: "numeric",
          day: "2-digit",
        });
    }
  }
}

export default Payments;