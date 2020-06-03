import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../reducer'

export const LoginRoute = ({ component: Component, ...rest }: any) => {
    const auth = useSelector((state: RootState) => state.auth)
        
    return (
        <Route {...rest} render={props => (
            auth.loggedIn
                ? <Component {...props} />
                : <Redirect to={`/login?url=${encodeURIComponent(props.location.pathname)}`} />
        )} />
)}