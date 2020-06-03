import { userService } from '../service'
import { history } from '../helper'
import {
    alertError, 
    authRequest, authSuccess, authFailure, authLogout,
    setRegisterState,
} from '../reducer'
import { IUser } from '../common'

export const userActions = {
    login,
    logout,
    register,
}

function login(username: string, password: string, remember: boolean, returnUrl: string) {
    return (dispatch: any) => {
        dispatch(authRequest())
    
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

function register(user: IUser) {
    return (dispatch: any) => {
        dispatch(setRegisterState(true))

        userService.register(user)
        .then(
            user => { 
                dispatch(setRegisterState(false))
                history.push('/register/welcome')
            },
            error => {
                dispatch(setRegisterState(false))
                dispatch(alertError(error.toString()))
            }
        )
    }
}