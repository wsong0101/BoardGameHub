import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../reducer'

export const AdminRoute = ({ component: Component, ...rest }: any) => {
    const auth = useSelector((state: RootState) => state.auth)

    return (
        <Route {...rest} render={props => (
            auth.user.Authority > 99
                ? <Component {...props} />
                : <Redirect to={`/login?url=${encodeURIComponent(props.location.pathname)}`} />
        )} />
)}