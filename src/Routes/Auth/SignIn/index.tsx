import React, {useState} from "react";
import styles from './SignIn.module.scss';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link, useHistory} from 'react-router-dom';
import {useFirebase} from 'react-redux-firebase';
import Loader from "../../../Components/Loader";
import Box from "@material-ui/core/Box";

const SignIn: React.FC = props => {
    const history = useHistory();
    const firebase = useFirebase()
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorPassword, setPasswordError] = React.useState('');
    const [errorFirebase, setFirebaseError] = React.useState('');
    const [loading, setLoading] = useState(false);

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
            return false;
        }
        return true
    }
    async function handleSubmitIn(e: React.SyntheticEvent) {
        e.preventDefault()
        try {
            setLoading(true);
            let check = checkEmail();
            check = checkPassword() && check;
            if (check) {
                await firebase.login({
                    email,
                    password,
                });
                history.push('/');
            }
        } catch (error) {
            setFirebaseError(error.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className={styles.SignIn}>
            <form className={styles.SignInForm} onSubmit={handleSubmitIn}>
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    className={styles.SignElForm}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={checkEmail}
                    error={!!emailError}
                    helperText={emailError}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    className={styles.SignElForm}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={checkPassword}
                    error={!!errorPassword}
                    helperText={errorPassword}
                />
                <div className={styles.BoxBtnIn}>
                    <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                        Sign In
                    </Button>
                    <Box mb={2} />
                    <Button component={Link} to="/auth/sign-up" color="primary" fullWidth>
                        Sign Up
                    </Button>
                </div>
                {errorFirebase !== "" && <p className={styles.errorText}>{errorFirebase}</p>}
                {loading && <Loader />}
            </form>
        </div>
    );
};

export default SignIn;
