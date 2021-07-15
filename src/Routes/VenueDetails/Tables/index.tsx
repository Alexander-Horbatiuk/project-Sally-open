import React from 'react'
import TableCard from './Cards'
import styles from './Tables.module.scss'

import { useParams } from 'react-router-dom';
import { functions } from "../../../firebase";

import Loader from "../../../Components/Loader";

import { Button, TextField } from '@material-ui/core';

interface ITable {
    _id: string; // table document ID
    code: string; // table code
    id: string; // venue ID
    t: string | number; // table ID
    type: "table-service" | "table-service-pi" | "self-service" | undefined;
}

const Tables: React.FC = (props) => {
    const { id } = useParams<{ id: string }>();

    const [fetching, setFetching] = React.useState(true)
    const [loading, setLoading] = React.useState(false)
    const [tables, setTables] = React.useState<ITable[]>([])

    const [errorTableIds, setErrorTableIds] = React.useState("")

    const [newTableIds, setNewTableIds] = React.useState("");

    React.useEffect(() => {
        getTables()

        async function getTables() {
            const getTablesFunc = functions.httpsCallable("admin-venue-tables-get")
    
            await getTablesFunc({ id: id }).then((res) => {
                setFetching(false)
                console.log(res.data)
                if (res.data) {
                    let tables = res.data
                    tables.sort((a: ITable, b: ITable) => Number(a.t) - Number(b.t))
                    setTables(tables)
                }
            })
        }
    }, [id])

    async function newTable() {
        if (!isValidTableIds()) {
            return;
        }

        setLoading(true)
        const newTableFunc = functions.httpsCallable("admin-venue-tables-new")

        await newTableFunc({ v_id: id, tableIds: newTableIds }).then((res) => {
            let tables = res.data
            setNewTableIds("")
            setTables(prevState => [...prevState, ...tables])
            setLoading(false)
        })
    }

    const isValidTableIds = () => {
        if (!newTableIds) {
            setErrorTableIds(`Required`);
            return false;
        } else {
            setErrorTableIds('');
            return true;
        }
    }

    const onTextChange = (text: string) => {
        let idsNum = text.split(",").length

        if (idsNum > 5) {
            setErrorTableIds("No more than 5 tables per request")
            return;
        }

        text = text.replace(/[^a-zA-Z0-9 ,]/g, "")

        setNewTableIds(text)
    }

    return (
        <div className={styles.Container}>
            {/* <TableCard id={'1'} serviceIndex={1} code={'John Dou'} />
            <TableCard id={'01'} serviceIndex={3} code={'Jone Smith'} />
            <TableCard id={'2'} serviceIndex={2} code={'babe Smith-Dou'} /> */}

            {!fetching ? <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <TextField
                    id="new-table-id"
                    label="Table IDs"
                    placeholder='2, 5, 12, 3A, 3B'
                    variant="outlined"
                    style={{ marginRight: 15 }}
                    onChange={(e) => onTextChange(e.target.value)}
                    value={newTableIds}
                    error={!!errorTableIds}
                    helperText={errorTableIds}
                    className={styles.txtNewTables}
                />
                <Button variant="contained" color="primary" type="submit" disabled={loading} onClick={() => newTable()}>
                    + ADD TABLES
                </Button>
            </div> : null}

            <div className={styles.TablesContainer}>
                {!fetching && tables.length > 0 ? tables.map(table => {
                    return (
                        <TableCard key={table.code} _id={table._id} id={table.t} code={table.code} type={table.type} />
                    )
                }) : null}
            </div>

            {(fetching || loading) && <Loader />}
        </div>
    )
}

export default Tables;