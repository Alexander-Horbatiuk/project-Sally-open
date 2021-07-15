import React from 'react';
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import styles from './Logo.module.scss';
import logo from './logo.svg'
const Logo:React.FC = props => {
    return <Typography component={Link} to={"/"} className={styles.Logo} variant={"inherit"}>
        <img src={logo} alt="" className={styles.LogoImg}/>
    </Typography>
}

export default Logo;