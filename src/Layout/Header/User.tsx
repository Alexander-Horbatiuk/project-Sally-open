import React from 'react';
import { useSelector } from "react-redux";
import { IRootState } from "../../Redux/rootReducer";
import { isEmpty, isLoaded } from "react-redux-firebase";

import styles from './User.module.scss';

import Button from '@material-ui/core/Button';
import { Gift } from "../../assets/icons"

import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useFirebase } from 'react-redux-firebase'
import { Link } from 'react-router-dom';

const userSelector = (state: IRootState) => {
    const { firebase } = state;
    return { auth: firebase.auth, profile: firebase.profile };
};

const User: React.FC = props => {
    const { auth, profile } = useSelector(userSelector)
    const firebase = useFirebase()

    if (isLoaded(auth) && !isEmpty(auth)) {
        return <div className={styles.NameUserBox}>
            <div className={styles.Money}>
                <img src={Gift} className={styles.Gift} color="#2FBF71" alt="Gift Icon" />
                {profile.giftsRevenue || 0} €
            </div>

            <div className={styles.NameUser}>
                {profile.name}
            </div>

            <div>
                <IconButton aria-label="delete" color="primary" onClick={() => firebase.logout()} >
                    <ExitToAppIcon />
                </IconButton>
            </div>

        </div>
    }

    return (
        <div className="">

            <Button component={Link} to="/auth/Sign-in" className={styles.ButtonLogin}>
                Log In
            </Button>
        </div>
    )
}

export default User;