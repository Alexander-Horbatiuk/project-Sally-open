import React, { useState } from 'react';
import { Button, FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import InputFile from '../../../../Components/Forms/InputFile';
import { useParams } from 'react-router';

// @ts-ignore
import PhoneInput from 'react-phone-input-material-ui';
import ReactSelect from "react-select";

import styles from "../Settings.module.scss";

import tagsArray from "../../../../assets/misc/tags.json";

import { auth, firestore, storage } from '../../../../firebase';

import IVenue from "../../../../types/IVenue";

interface IProps {
    loading: boolean;
    default: IVenue;
    setLoading: Function;
}

const Settings: React.FC<IProps> = (props) => {
    const { id } = useParams<{ id: string }>();

    const [venueName, setVenueName] = useState("");
    const [errorVenueName, setErrorVenueName] = useState("");

    const [description, setDescription] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const [tags, setTags] = useState<string[]>([])

    const [motd, setMotd] = useState("");

    const [pos, setPos] = useState<any>("");
    const [errorPos, setErrorPos] = useState("");

    const [currency, setCurrency] = useState<any>("");
    const [errorCurrency, setErrorCurrency] = useState<string>("");

    const [phone, setPhone] = useState(0);
    const [phoneError, setPhoneError] = useState("");

    const [phoneFormatted, setPhoneFormatted] = React.useState("");
    const [phoneFormat, setPhoneFormat] = React.useState("");

    const [logoURL, setLogoURL] = useState<string>("");
    const [logoFile, setLogoFile] = useState<File>();

    const [coverURL, setCoverURL] = useState<string>("");
    const [coverFile, setCoverFile] = useState<File>();

    const [changes, setChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (props.default) {
            const { name, description, phone,  phoneFormatted, tags, currency, motd, pos, logoURL, coverURL } = props.default

            setVenueName(name)
            setDescription(description)
            setPhone(phone)
            setPhoneFormatted(phoneFormatted)
            setTags(tags || [])
            setCurrency(currency)
            setMotd(motd)
            setPos(pos)
            setLogoURL(logoURL)
            setCoverURL(coverURL)
        }
    }, [props.default])

    React.useEffect(() => {
        setLoading(props.loading)
    }, [props.loading])

    const handleSave = async (e) => {
        e.preventDefault();

        let isValid = isValidVenueName();
        isValid = isValidVenueDescription() && isValid;
        isValid = isValidPhone() && isValid;
        isValid = isValidCurrency() && isValid;

        if (!isValid || props.loading) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return;
        }

        props.setLoading(true);

        const uid = auth.currentUser?.uid;

        let newLogoURL;

        if (logoFile) {
            const logoRef = storage.ref(`/${uid}/logo/`).child(logoFile.name);

            await logoRef.put(logoFile);

            newLogoURL = await logoRef.getDownloadURL();
        }

        let newCoverURL;

        if (coverFile) {
            const coverRef = await storage.ref(`/${uid}/logo/`).child(coverFile.name)

            await coverRef.put(coverFile);

            newCoverURL = await coverRef.getDownloadURL();
        }

        await firestore.collection("venues").doc(id).update({
            name: venueName,
            description: description,
            phone: phone,
            phoneFormatted: phoneFormatted,
            tags: tags,
            currency: currency,
            motd: motd,
            pos: pos,
            logoURL: newLogoURL || logoURL || "",
            coverURL: newCoverURL || coverURL || ""
        })

        props.setLoading(false)
        setChanges(false)
    }

    const handleBlur = (e: React.FocusEvent<any>) => {
        setChanges(true);

        switch (e.target.id) {
            case 'venue-name':
                isValidVenueName();
                break;
            case 'venue-description':
                isValidVenueDescription();
                break;
            case 'phone':
                isValidPhone();
                break;
            case 'currency':
                isValidCurrency();
                break;
        }
    }

    const handleFocusInput = (e: React.FocusEvent) => {
        setChanges(true);

        switch (e.target.id) {
            case 'venue-name':
                setErrorVenueName("");
                break;
            case 'venue-description':
                setErrorDescription("");
                break;
            case 'phone':
                setPhoneError("");
                break;
            case 'currency':
                setErrorCurrency("");
                break;
            case 'pos':
                setErrorPos("");
                break;
        }
    }

    function isValidPhone(format: string | null | undefined = null) {
        setPhoneError('')
        const testReg = !format ? phoneFormat : format;
        if (testReg === "") {
            if (!(phone > 10000000)) {
                setPhoneError("Field is empty")
                return false
            }
        } else {
            setPhoneFormat(testReg);
            if (!new RegExp(escapeRegExp(testReg)).test(phoneFormatted)) {
                setPhoneError("Invalid phone number")
                return false;
            }
        }
        return true
    }

    function escapeRegExp(string) {
        return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // const checkForChanges = () => {
    //     const def = props.default;
    //     if (def.name !== venueName || def.description !== description || def.phone !== phone 
    //         || def.tags !== tags || def.currency !== currency || def.motd !== motd || def.pos !== pos
    //         || def.logoURL !== logoURL || def.coverURL !== coverURL) {
    //             setChanges(true)
    //         } else {
    //             setChanges(false)
    //         }
    // }

    const isValidVenueName = () => {
        if (venueName === '' && venueName.length < 3) {
            setErrorVenueName(`Field is empty`);
            return false;
        } else {
            setErrorVenueName('');
            return true;
        }
    }


    const isValidVenueDescription = () => {
        if (venueName === '' && venueName.length < 3) {
            setErrorDescription(`Field is empty`);
            return false;
        } else {
            setErrorDescription('');
            return true;
        }
    }

    const isValidCurrency = () => {
        if (!currency) {
            setErrorCurrency('Required');
            return false;
        } else {
            setErrorCurrency("");
            return true;
        }
    }

    return (
        <div className={styles.FormWrapper}>
            <div className={styles.FormContent}>
                <h2>General</h2>
                <br />
                <TextField
                    value={venueName}
                    id="venue-name"
                    label="Venue Name"
                    type="text"
                    error={!!errorVenueName}
                    helperText={errorVenueName}
                    variant="outlined"
                    onChange={e => setVenueName(e.target.value)}
                    onFocus={handleFocusInput}
                    onBlur={handleBlur}
                />

                <TextField
                    value={description}
                    id="venue-description"
                    label="Venue Description"
                    type="text"
                    error={!!errorDescription}
                    helperText={errorDescription}
                    variant="outlined"
                    onChange={e => setDescription(e.target.value)}
                    onFocus={handleFocusInput}
                    onBlur={handleBlur}
                />

                <PhoneInput
                    value={phone}
                    specialLabel={""}
                    style={{ width: "100%" }}
                    onFocus={(e, formatData) => handleFocusInput(e)}
                    onChange={(value, formatData, b, formatValue) => {
                        setPhone(value)
                        setPhoneFormatted(formatValue);
                    }}
                    inputProps={{
                        id: "phone",
                        variant: "outlined",
                        error: !!phoneError,
                        helperText: phoneError,
                        fullWidth: true,
                        label: "Phone for reservation",
                        name: "phone"
                    }}
                    onBlur={(e, formatData) => {
                        isValidPhone(formatData.format);
                        handleBlur(e);
                    }}
                    component={TextField}
                    className={styles.Input}
                />

                <ReactSelect
                    value={tags.map(item => ({ value: item, label: item }))}
                    onChange={(ev) => setTags(ev.map(item => item.value))}
                    onFocus={handleFocusInput}
                    onBlur={handleBlur}
                    options={tags.length < 3 ? tagsArray.map(item => ({ value: item, label: item })) : []}
                    isMulti={true}
                    styles={{
                        control: (base) => ({
                            ...base,
                            height: "100%"
                        }),
                        container: (base) => ({
                            ...base,
                            zIndex: 3
                        })
                    }}
                    placeholder="Select Tags (3 max)"
                />


                <FormControl variant="outlined" className={styles.formControl}>
                    <InputLabel htmlFor="pos">Currency</InputLabel>
                    <Select
                        native
                        value={currency}
                        onChange={e => setCurrency(e.target.value ?? '')}
                        label="Currency"
                        inputProps={{
                            name: 'Currency',
                            id: 'currency',
                        }}
                        onFocus={handleFocusInput}
                        onBlur={handleBlur}
                        error={!!errorCurrency}
                    >
                        <option aria-label="None" value="" />
                        <option value='€'>EURO €</option>
                        <option value='$'>DOLLAR $</option>
                        <option value='R'>rand R</option>
                    </Select>
                </FormControl>

                <TextField
                    value={motd}
                    id="motd"
                    label="Message Of The Day (MOTD)"
                    type="text"
                    helperText={""}
                    variant="outlined"
                    onFocus={handleFocusInput}
                    onBlur={handleBlur}
                    onChange={e => setMotd(e.target.value)}
                />

                <FormControl variant="outlined" className={styles.formControl}>
                    <InputLabel htmlFor="pos">POS</InputLabel>
                    <Select
                        native
                        value={pos}
                        onChange={e => setPos(e.target.value ?? '')}
                        label="POS"
                        inputProps={{
                            name: 'POS',
                            id: 'pos',
                        }}
                        onFocus={handleFocusInput}
                        onBlur={handleBlur}
                        error={!!errorPos}
                    >
                        <option aria-label="None" value="" />
                        <option value='aloha'>Aloha</option>
                        <option value='gladius'>Gladius</option>
                        <option value='micros3700'>Micros 3700</option>
                    </Select>
                </FormControl>
            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                <InputFile
                    title={"Venue Logo"}
                    file={logoFile}
                    type={"image"}
                    onChange={(file) => {
                        setLogoFile(file);
                        setChanges(true)
                    }}
                    defaultSrc={logoURL}
                />

                <InputFile
                    title={"Venue Cover"}
                    file={coverFile}
                    onChange={(file) => {
                        setCoverFile(file);
                        setChanges(true)
                    }}
                    type={"image"}
                    defaultSrc={coverURL}
                />
            </div>

            <Button
                variant="contained"
                size={"large"}
                color="primary"
                disabled={!changes || loading}
                className={styles.SaveButton}
                onClick={handleSave}
            >
                SAVE CHANGES
            </Button>
        </div>
    )

}


export default Settings;