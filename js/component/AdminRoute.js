import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const AdminRoute = ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth)

    return (
        <Route {...rest} render={props => (
            auth.user.authority > 99
                ? <Component {...props} />
                : <Redirect to={`/login?url=${encodeURIComponent(props.location.pathname)}`} />
        )} />
)}