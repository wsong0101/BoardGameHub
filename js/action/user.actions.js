import { userService } from '../service'
import { history } from '../helper'
import {
    alertError, 
    authRequest, authSuccess, authFailure, authLogout,
    registerRequest, registerSuccess, registerFailure,
} from '../reducer'

export const userActions = {
    login,
    logout,
    register,
}

function login(username, password, remember, returnUrl) {
    return dispatch => {
        dispatch(authRequest({ username }))
    
        userService.login(username, password, remember)
            .then(
                user => { 
                    dispatch(authSuccess(user))
                    returnUrl = returnUrl ? returnUrl : "/"
                    history.push(returnUrl)
                },
                error => {
                    dispatch(authFailure())
                    dispatch(alertError(error.toString()))
                }
            )
    }
}

function logout() {
    userService.logout()
    .then( () => {
        history.push('/')
    } )
    return authLogout()
}

function register(user) {
    return dispatch => {
        dispatch(registerRequest(user))

        userService.register(user)
        .then(
            user => { 
                dispatch(registerSuccess())
                history.push('/register/welcome')
            },
            error => {
                dispatch(registerFailure(error.toString()))
                dispatch(alertError(error.toString()))
            }
        )
    }
}