/* eslint-disable react/jsx-no-undef */
import React from 'react';
import Button from '@material-ui/core/Button';
import { DeleteOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import styles from './Cards.module.scss';
import QrCodeIcon from '../Svg/index';

import { useParams } from 'react-router-dom';
import { functions } from '../../../../firebase';

const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

function TableCard(props) {

    const { id: v_id } = useParams<{ id: string }>()

    const { id: t_id, code, type: initialType, _id } = props

    const [loading, setLoading] = React.useState(false)

    const [deleted, setDeleted] = React.useState(false)

    const [tableID, setTableID] = React.useState(t_id)
    const [type, setType] = React.useState(initialType)

    React.useEffect(() => {

    }, [])

    const getQRCode = async () => {
        setLoading(true)
        const func = functions.httpsCallable("admin-venue-tables-getQRCode")

        await func({ v_id: v_id, id: _id }).then(res => {
            console.log(res.data)
            openInNewTab(res.data)
        })

        setLoading(false)

        return;
    }

    const saveTable = async () => {
        setLoading(true)

        const func = functions.httpsCallable("admin-venue-tables-save")

        await func({ id: _id, t_id: tableID, type: type }).then(res => {
            console.log(res.data)
        })

        setLoading(false)

        return;
    }

    const deleteTable = async () => {
        setLoading(true)

        const func = functions.httpsCallable("admin-venue-tables-delete")

        await func({ id: _id }).then(res => {
            console.log(res.data)
            setDeleted(true)
        })

        setLoading(false)

        return;
    }

    if (deleted) {
        return null
    }

    return (
        <form className={styles.NewCardBox}>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <h2>Table {tableID}</h2>

                <IconButton aria-label="delete" onClick={() => deleteTable()} disabled={loading}>
                    <DeleteOutlined style={{ color: "red" }} />
                </IconButton>
            </div>

            <label className={styles.Text}>Table ID <input type="text" value={tableID} onChange={(e) => setTableID(e.target.value)} /></label>
            <label className={styles.Text}>Table Code <input type="text" value={code} onChange={() => { }} disabled={true} /></label>

            <label className={styles.RadioButton}>
                <input type="radio" name="service" checked={!type || type === "table-service"} onChange={() => setType("table-service")} />
                <span>Table Service</span>
            </label>
            <label className={styles.RadioButton}>
                <input type="radio" name="service" checked={type === "table-service-pi"} onChange={() => setType("table-service-pi")} />
                <span>Table Service, pay immediately</span>
            </label>
            <label className={styles.RadioButton}>
                <input type="radio" name="service" checked={type === "self-service"} onChange={() => setType("self-service")} />
                <span>Self Service </span>
            </label>

            <div className="">
                <Button variant="contained" color="primary" disabled={loading} onClick={() => saveTable()}>
                    save
                </Button>
                <Button variant="outlined" size="large" color="primary" onClick={() => getQRCode()} disabled={loading}>
                    <QrCodeIcon />
                    QR Code
                </Button>
            </div>
        </form>
    )
}

export default TableCard;