import React from 'react';
import styles from './Header.module.scss';
import User from "./User";
import Logo from "../../Components/Logo";

const Header = () => {
    return(
        <header className={styles.Container}>
            <Logo />
            <div style={{flex: 1}} />
            <User />
        </header>
    );
}

export default Header;