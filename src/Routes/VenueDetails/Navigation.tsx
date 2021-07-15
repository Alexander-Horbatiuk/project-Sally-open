import React from 'react'
import styles from './Navigation.module.scss';
import {NavLink, useParams} from "react-router-dom";

const Navigation: React.FC = (props) => {
    const {id} = useParams<{ id: string }>();

    return (
        <div className={styles.MenuNav}>

            <NavLink to={`/venue/${id}/menu-builder`} className={styles.link} activeClassName={styles.Activelink}>
                Menu Builder
            </NavLink>

            <NavLink to={`/venue/${id}/tables`} className={styles.link} activeClassName={styles.Activelink}>
                Tables
            </NavLink>

            <NavLink to={`/venue/${id}/analytics`} className={styles.link} activeClassName={styles.Activelink}>
                Analytics
            </NavLink>

            <NavLink to={`/venue/${id}/settings`} className={styles.link} activeClassName={styles.Activelink}>
                Settings
            </NavLink>

            <NavLink to={`/venue/${id}/payments`} className={styles.link} activeClassName={styles.Activelink}>
                Payments
            </NavLink>
        </div>
    )

}


export default Navigation;