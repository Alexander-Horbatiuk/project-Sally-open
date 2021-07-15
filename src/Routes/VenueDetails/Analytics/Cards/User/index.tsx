import React from 'react';
import styles from './index.module.scss';
import { Star } from '@material-ui/icons';

import IUser from '../../../../../types/IUser';

const UserCard: React.FC<IUser & { openModal: Function }> = (props) => {
  const { uid, firstname, scans, photoURL } = props;

  const renderFirstChar = (name) => name.charAt(0).toUpperCase();

  return <>
    <div className={styles.UserCard} onClick={() => props.openModal(uid)}>
      <div className={styles.ImgContainer}>
        {photoURL ? <img src={photoURL} alt="img" className={styles.Photo} />
          : <span className={styles.Photo}><b className={styles.FirstChar}>{renderFirstChar(firstname)}</b></span>
        }
      </div>

      <div className={styles.UserInfo}>
        <p className={styles.UserName}>
          <span className={styles.MarkerBold}>{firstname}</span>
        </p>
        <span className={styles.Amount}>
          <div style={{ display: "inline-block" }}>
            <span style={{ display: "flex", alignItems: 'center' }}>
              5 <Star fontSize="small" color="inherit" className={styles.Star} />
            </span>
          </div>
          <span>Scans: <span className={styles.MarkerBold}>{scans}</span></span>
        </span>
      </div>
    </div>
  </>

}
export default UserCard;