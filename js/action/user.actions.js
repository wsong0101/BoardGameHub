import { userConstants } from '../constant'
import { userService } from '../service'
import { alertActions } from './'
import { history } from '../helper'
import {
    alertError, 
    authRequest, authSuccess, authFailure, authLogout,
    registerRequest, registerSuccess, registerFailure,
    collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
    showModal as reducerShowModal, hideModal as reducerHideModal, updateModal as reducerUpdateModal,
    itemRequest, itemSuccess, itemFailure, itemUpdate,
} from '../reducer'

export const userActions = {
    login,
    logout,
    register,
    getCollection,
    showModal,
    hideModal,
    updateCollection,
    getItemInfo,
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
        }
    )
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

function getCollection(userId, category, page) {
    return dispatch => {
        dispatch(collectionRequest())

        userService.getCollection(userId, category, page)
        .then(
            data => {
                dispatch(collectionSuccess(data))
            },
            error => {
                dispatch(collectionFailure())
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function showModal(collection) {
    return reducerShowModal(collection)
}

function hideModal() {
    return reducerHideModal()
}

function updateCollection(id, type, value) {
    return dispatch => {
        userService.updateCollection(id, type, value)
        .then(
            data => {
                dispatch(collectionUpdate(id, type, value))
                dispatch(reducerUpdateModal(type, value))
                dispatch(itemUpdate(type, value))
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function getItemInfo(id) {
    return dispatch => {
        dispatch(itemRequest())

        userService.getItemInfo(id)
        .then(
            data => {
                dispatch(itemSuccess(data))
            },
            error => {
                dispatch(itemFailure(error.toString()))
                dispatch(alertError(error.toString()))
            }
        )
    }
}