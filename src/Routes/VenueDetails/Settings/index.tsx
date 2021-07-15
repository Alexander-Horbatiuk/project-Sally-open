import React, { useState } from 'react';
import { useParams } from 'react-router';
import GeneralSettings from "./Sections/General";
import Loader from "../../../Components/Loader";
import { firestore } from "../../../firebase";

const Settings: React.FC = (props) => {

    const { id } = useParams<{ id: string }>();

    const [generalLoading, setGeneralLoading] = useState<boolean>(true)
    const [generalSettings, setGeneralSettings] = useState<any>(null)

    React.useEffect(() => {
        getGeneral()

        async function getGeneral() {
            const snapshot = await firestore.collection(`venues`).doc(id).get();
            setGeneralSettings(snapshot.data())
            setGeneralLoading(false)
        }
    }, [id])

    return (
        <div style={{ margin: 25, display: "flex", flexDirection: "column" }}>

            <GeneralSettings
                loading={generalLoading}
                default={generalSettings}
                setLoading={(val:boolean) => setGeneralLoading(val)}
            />

            {generalLoading && <Loader  />}
        </div>
    )
}

export default Settings;