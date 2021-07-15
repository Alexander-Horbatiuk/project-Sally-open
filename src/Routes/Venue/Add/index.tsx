import React, { useState } from 'react';
import styles from './Add.module.scss';
import { Button, FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader";
import InputFile from "./InputFile";
import { Link, useHistory } from "react-router-dom";
// @ts-ignore
import PhoneInput from 'react-phone-input-material-ui';

import { functions } from "../../../firebase";

const VenueAdd: React.FC = props => {
    const firebase = useFirebase();
    const history = useHistory();

    const uid = useSelector((state: any) => {
        return state.firebase.auth.uid;
    });

    const regEx = /[^\d]/g; // for validation is number integer

    const [venueName, setVenueName] = useState('');
    const [errorVenueValue, setErrorVenueValue] = useState('');

    const [tableCount, setTableCount] = useState('');

    const [errorTotalNumber, setErrorTotalNumber] = useState('');

    const [tableNumbers, setNumberTable] = useState('');
    const [errorNumberTable, setErrorNumberTable] = useState('');

    const [venueAddress, setVenueAddress] = useState('');
    const [errorVenueAddress, setErrorVenueAddress] = useState('');

    const [countryValue, setCountryValue] = useState<any>('');
    const [errorCountryValue, setErrorCountryValue] = useState('');

    const [phone, setPhone] = React.useState(0);
    const [phoneError, setPhoneError] = useState('');

    const [phoneFormatted, setPhoneFormatted] = React.useState("");
    const [phoneFormat, setPhoneFormat] = React.useState("");

    const [logoFile, setLogoFile] = useState<File>();
    const [coverFile, setCoverFile] = useState<File>();
    
    const [isLoading, setIsLoading] = useState(false);

    const [firebaseError, setFirebaseError] = useState<string>('');

    const handleBlur = (e: React.FocusEvent<any>) => {
        switch (e.target.id) {
            case 'venue-name':
                isValidVenueInput();
                break;
            case 'total-number':
                isValidTotalNumberInput();
                break;
            case 'number-table':
                isValidNumberTableInput();
                break;
            case 'venue-address':
                isValidVenueAddress();
                break;
            case 'phone':
                isValidPhone();
                break;
            case 'country':
                isValidCountryValue();
                break;
        }
    }

    const handleFocusInput = (e: React.FocusEvent) => {
        switch (e.target.id) {
            case 'venue-name':
                setErrorVenueValue('');
                break;
            case 'total-number':
                setErrorTotalNumber('');
                break;
            case 'number-table':
                setErrorNumberTable('');
                break;
            case 'venue-address':
                setErrorVenueAddress('');
                break;
            case 'phone':
                setPhoneError('');
                break;
            case 'country':
                setErrorCountryValue('');
        }
    }

    const isValidVenueInput = () => {
        if (venueName === '' && venueName.length < 3) {
            setErrorVenueValue(`Field is empty`);
            return false;
        } else {
            setErrorVenueValue('');
            return true;
        }
    }

    const isValidTotalNumberInput = () => {
        if (tableCount === '' || regEx.test(tableCount)) {
            setErrorTotalNumber('Field is empty');
            return false;
        } else {
            setErrorTotalNumber('');
            return true;
        }
    }

    const isValidNumberTableInput = () => {
        if (tableNumbers === '') {
            setErrorNumberTable('Field is empty');
            return false;
        } else {
            setErrorNumberTable('');
            return true;
        }
    }

    const isValidVenueAddress = () => {
        if (venueAddress === '' && venueAddress.length < 3) {
            setErrorVenueAddress(`Field is empty`);
            return false;
        } else {
            setErrorVenueAddress('');
            return true;
        }
    }

    const isValidCountryValue = () => {
        if (countryValue === '') {
            setErrorCountryValue('Field is empty');
            return false;
        } else {
            setErrorCountryValue('');
            return true;
        }
    }

    function isValidPhone(format: string | null | undefined = null) {
        setPhoneError('')
        const testReg = !format ? phoneFormat : format;
        if (testReg === "") {
            if (!(phone > 10000000)) {
                setPhoneError('Field is empty')
                return false
            }
        } else {
            setPhoneFormat(testReg);
            if (!new RegExp(escapeRegExp(testReg)).test(phoneFormatted)) {
                setPhoneError("Wrong phone number")
                return false;
            }
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFirebaseError("");

        let isValid = isValidVenueInput();
        isValid = isValidTotalNumberInput() && isValid;
        isValid = isValidNumberTableInput() && isValid;
        isValid = isValidVenueAddress() && isValid;
        isValid = isValidPhone() && isValid;
        isValid = isValidCountryValue() && isValid;

        if (!isValid) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return;
        }

        setIsLoading(true);

        try {
            const coverSnapshot = coverFile ? await firebase.storage()
                .ref(`/${uid}/cover/`).child(coverFile.name)
                .put(coverFile) : undefined;


            const logoSnapShot = logoFile ? await firebase.storage()
                .ref(`/${uid}/logo/`).child(logoFile.name)
                .child(logoFile.name)
                .put(logoFile) : undefined;

            const addVenueFunc = functions.httpsCallable("admin-venue-add")
            
            let newVenueID = await addVenueFunc({
                    name: venueName,
                    description: "",
                    phone,
                    phoneFormatted,
                    tableCount: Number.parseInt(tableCount),
                    tableNumbers: tableNumbers,
                    address: venueAddress,
                    country: countryValue,
                    coverImgRef: coverSnapshot?.ref?.fullPath ?? '',
                    logoImgRef: logoSnapShot?.ref?.fullPath ?? '',
                    adminUser: [uid]
            }).then((res) => {
                return res.data;
            })

            history.push(`/stripe/add/${newVenueID}`);

        } catch (err) {
            setFirebaseError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    return (
        <div className={styles.Container}>
            <form className={styles.Form} noValidate={true} autoComplete="off">
                <h3 className={styles.Title}>Add Venue</h3>
                <div className={styles.BoxInputs}>
                    {renderTextInputs()}
                </div>
                {renderFiles()}

                {firebaseError !== "" && <p className={styles.CatchError}>
                    {firebaseError}
                </p>}

                <div className={styles.ActionBox}>
                    <Button
                        variant="outlined"
                        component={Link}
                        type={'button'}
                        to={'/'}
                        size={"large"}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        color="primary"
                        size={"large"}
                        disabled={isLoading}
                    >
                        Submit
                    </Button>
                </div>
                {isLoading && <Loader />}
            </form>
        </div>
    );

    function renderTextInputs() {
        return <div className={styles.InputsWrapper}>
            <TextField
                value={venueName}
                id="venue-name"
                label="Venue Name"
                type="text"
                error={!!errorVenueValue}
                helperText={errorVenueValue}
                variant="outlined"
                onFocus={handleFocusInput}
                onChange={e => setVenueName(e.target.value)}
                onBlur={handleBlur}
                className={styles.Input}
            />
            <TextField
                value={venueAddress}
                id="venue-address"
                label="Venue Address"
                type="text"
                variant="outlined"
                error={!!errorVenueAddress}
                helperText={errorVenueAddress}
                onFocus={handleFocusInput}
                onChange={e => setVenueAddress(e.target.value)}
                onBlur={handleBlur}
                className={styles.Input}
            />

            <FormControl variant="outlined" className={styles.formControl}>
                <InputLabel htmlFor="country">Country</InputLabel>
                <Select
                    native
                    value={countryValue}
                    onChange={e => setCountryValue(e.target.value ?? '')}
                    label="Country"
                    inputProps={{
                        name: 'Country',
                        id: 'country',
                    }}
                    onFocus={handleFocusInput}
                    onBlur={handleBlur}
                    error={!!errorCountryValue}
                >
                    <option aria-label="None" value="" />
                    <option value='Cyprus'>Cyprus</option>
                    <option value='South Africa'>South Africa</option>
                    <option value='France'>France</option>
                </Select>
            </FormControl>

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

            <TextField
                value={tableCount}
                id="total-number"
                label="Total number of tables that you want QR codes for"
                type="number"
                error={!!errorTotalNumber}
                helperText={errorTotalNumber}
                variant="outlined"
                onFocus={handleFocusInput}
                onChange={e => setTableCount(e.target.value)}
                onBlur={handleBlur}
                className={styles.Input}
            />
            <TextField
                value={tableNumbers}
                id="number-table"
                label="Numbers of each table that you want QR codes for"
                type="text"
                variant="outlined"
                error={!!errorNumberTable}
                helperText={errorNumberTable}
                onFocus={handleFocusInput}
                onChange={(e) => setNumberTable(e.target.value)}
                onBlur={handleBlur}
                className={styles.Input}
                placeholder='2, 5, 12, 14, 15'
            />
        </div>
    }

    function renderFiles() {
        return <div className={styles.BoxFiles}>
            <div className={styles.BoxRow}>
                <InputFile
                    title={"Venue cover"}
                    file={coverFile}
                    onChange={setCoverFile}
                    type={"image"}
                />

                <InputFile
                    title={"Venue logo"}
                    file={logoFile}
                    type={"image"}
                    onChange={setLogoFile}
                />
            </div>
        </div>
    }
}

export default VenueAdd;

