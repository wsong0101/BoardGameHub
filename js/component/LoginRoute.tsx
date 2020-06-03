import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const LoginRoute = ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth)
        
    return (
        <Route {...rest} render={props => (
            auth.loggedIn
                ? <Component {...props} />
                : <Redirect to={`/login?url=${encodeURIComponent(props.location.pathname)}`} />
        )} />
)}