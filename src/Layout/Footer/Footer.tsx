import React from 'react'
import styles from './Footer.module.scss';
import { Typography } from "@material-ui/core";

const Footer = () => {
    return (
        <footer className={styles.Container}>
            <Typography color={"textSecondary"} variant={"body2"}>
                Sally LTD © 2021
            </Typography>
        </footer>
    );
}

export default Footer;