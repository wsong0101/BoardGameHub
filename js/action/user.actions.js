import { userConstants } from '../constant'
import { userService } from '../service'
import { alertActions } from './'
import { history } from '../helper'
import {
    alertError, 
    authRequest, authSuccess, authFailure, authLogout,
    collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
    showModal as reducerShowModal, hideModal as reducerHideModal, updateModal as reducerUpdateModal,
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
        dispatch(request(user))

        userService.register(user)
        .then(
            user => { 
                dispatch(success())
                history.push('/register/welcome')
            },
            error => {
                dispatch(failure(error.toString()))
                dispatch(alertActions.error(error.toString()))
            }
        )
    }

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
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
                // dispatch(updateItemInfo(id, type, value))
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function getItemInfo(id) {
    return dispatch => {
        dispatch(request())

        userService.getItemInfo(id)
        .then(
            data => {
                dispatch(success(data))
            },
            error => {
                dispatch(failure(error.toString()))
                dispatch(alertActions.error(error.toString()))
            }
        )
    }
    
    function request() { return { type: userConstants.GET_ITEM_INFO_REQUEST } }
    function success(data) { return { type: userConstants.GET_ITEM_INFO_SUCCESS, data } }
    function failure(error) { return { type: userConstants.GET_ITEM_INFO_FAILURE, error } }
}

function updateItemInfo(id, type, value) {
    return { type: userConstants.UPDATE_ITEM_INFO, update: { id, type, value } }
}