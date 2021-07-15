import React from 'react';
import styles from './index.module.scss';
import { Star } from '@material-ui/icons';

import IRating from '../../../../../types/IRating';

const UserCard: React.FC<IRating> = (props) => {
    const { stars, comment, date } = props;

    const jsDate = new Date(date.seconds * 1000)
    return <>
        <div className={styles.Card}>
            <span style={{display: "flex", alignItems: 'center'}}>{stars} <Star /></span>
            <span style={{fontWeight: "bolder"}}>Comment:</span> {comment || "-"}
            <span style={{color: "gray"}}>{jsDate.toLocaleString()}</span>
        </div>
    </>

}
export default UserCard;