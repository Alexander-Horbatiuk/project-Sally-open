import React from 'react';
import styles from'./Layout.module.scss';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Routes from '../Routes';

const Layout = (props: any) => {
    return (
        <div className={styles.Layout}>
            <Header/>
            <main className={styles.Main}>
                <Routes />
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;