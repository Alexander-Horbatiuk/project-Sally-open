import React from 'react'
import {Redirect, Route} from 'react-router-dom';

import {useSelector} from 'react-redux'
import {isEmpty, isLoaded} from 'react-redux-firebase'

interface IProps {
    children?: React.ReactNode;
    path: string;
    exact?: boolean;
}

const PrivateRoute: React.FC<IProps> = ({children, path, exact = false}) => {

    const auth = useSelector((state: any) => state.firebase.auth)
    if (!isLoaded(auth)) {
        return null
    }
    return (
        <Route
            exact={exact}
            path={path}
            render={({location}) =>
                !isEmpty(auth) ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth/sign-in",
                            state: {from: location}
                        }}
                    />

                )
            }
        />
    );
}

export default PrivateRoute;