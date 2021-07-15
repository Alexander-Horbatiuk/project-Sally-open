import React from 'react';
import styles from './WelcomePage.module.scss';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
const WelcomePage: React.FC = () => {
  return (
    <div className={styles.WelcomePageWrapper}>
        <iframe className={styles.Video} src="https://www.youtube.com/embed/-I_ywELCxFE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <Button component={Link} to='/' variant="contained" color="primary" style={{maxWidth:"1000px", width: '100%', minHeight: "50px"}}>
          Go
        </Button>
    </div>
  );
}

export default WelcomePage;