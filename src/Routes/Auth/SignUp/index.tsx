import React from "react";
import styles from './SignUp.module.scss';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link, useHistory} from 'react-router-dom';
// @ts-ignore
import PhoneInput from 'react-phone-input-material-ui';
import {useFirebase} from 'react-redux-firebase'
import Loader from "../../../Components/Loader";
import Box from "@material-ui/core/Box";

const SignUp: React.FC = props => {
    const history = useHistory();
    const firebase = useFirebase();
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorPassword, setPasswordError] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [password2Error, setPassword2Error] = React.useState('');
    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [phone, setPhone] = React.useState(0);
    const [phoneFormatted, setPhoneFormatted] = React.useState("");
    const [phoneFormat, setPhoneFormat] = React.useState("");
    const [phoneError, setPhoneError] = React.useState<string>();
    const [errorFirebase, setErrorsFirebase] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    function checkEmail() {
        setEmailError('')
        let regEmail = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).test(email)
        if (!regEmail) {
            setEmailError('Wrong email address');
            return false
        }
        return true
    }

    function checkPassword() {
        setPasswordError('')
        if (password === '') {
            setPasswordError('Field is empty')
            return false
        } else if (password !== '' && password2 !== '' && password !== password2) {
            setPasswordError('Passwords don\'t match')
            return false;
        }
        return true
    }

    function checkPassword2() {
        setPassword2Error('')
        if (password2 === '') {
            setPassword2Error('Field is empty')
            return false
        } else if (password !== '' && password2 !== '' && password !== password2) {
            setPassword2Error('Passwords don\'t match');
            return false;
        }
        return true
    }

    function checkName() {
        setNameError('')
        if (name === '') {
            setNameError('Field is empty')
            return false
        }
        return true
    }

    function escapeRegExp(string) {
        return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function checkPhone(format: string | null | undefined = null) {
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

    async function handleSubmitUp(e: React.SyntheticEvent) {
        e.preventDefault()
        try {
            setLoading(true);
            let check = checkEmail();
            check = checkPassword() && check;
            check = checkPassword2() && check;
            check = checkName() && check;
            check = checkPhone() && check;

            if (check) {
                await firebase.createUser(
                    {
                        email,
                        password,
                        signIn: true,
                    },
                    {name, email, phone, phoneFormatted});
                history.push('/');
            }
        } catch (error) {
            setErrorsFirebase(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.SignUp}>
            <form className={styles.SignUpForm} onSubmit={handleSubmitUp}>
                <TextField
                    name="email"
                    label="Mail"
                    type="email"
                    variant="outlined"
                    value={email}
                    className={styles.SignElForm}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={checkEmail}
                    error={!!emailError}
                    helperText={emailError}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    className={styles.SignElForm}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={checkPassword}
                    error={!!errorPassword}
                    helperText={errorPassword}
                />
                <TextField
                    label="Confirm Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    className={styles.SignElForm}
                    value={password2}
                    onChange={e => setPassword2(e.target.value)}
                    onBlur={checkPassword2}
                    error={!!password2Error}
                    helperText={password2Error}
                />
                <TextField
                    name="name"
                    label="Name"
                    type="name"
                    variant="outlined"
                    className={styles.SignElForm}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={checkName}
                    error={!!nameError}
                    helperText={nameError}
                />

                <PhoneInput
                    value={phone}
                    specialLabel={""}
                    style={{width: "100%"}}
                    onChange={(value, formatData, b, formatValue) => {
                        setPhone(value)
                        setPhoneFormatted(formatValue);
                    }}
                    inputProps={{
                        variant: "outlined",
                        error: !!phoneError,
                        helperText: phoneError,
                        fullWidth: true,
                        label: "Phone",
                        name: "phone"
                    }}
                    onBlur={(e, formatData) => {
                        checkPhone(formatData.format);
                    }}
                    component={TextField}
                />

                <div className={styles.BoxBtnUp}>
                    <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                        Sign Up
                    </Button>
                    <Box mb={2} />
                    <Button component={Link} to="/auth/sign-in" color="primary" fullWidth>
                        Sign In
                    </Button>
                </div>
                {errorFirebase !== "" && <p className={styles.errorText}>{errorFirebase}</p>}
            </form>
            {loading && <Loader/>}
        </div>
    );
};

export default SignUp;