import { itemService } from '../service'
import { history } from '../helper'
import {
    alertError, 
    collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
    collectionImportRequest, collectionImportSuccess, collectionImportFailure,
    showModal as reducerShowModal, hideModal as reducerHideModal, updateModal as reducerUpdateModal,
    itemRequest, itemSuccess, itemFailure, itemUpdate,
    itemImportRequest, itemImportSuccess, itemImportFailure,
} from '../reducer'

export const itemActions = {
    getCollection,
    showModal,
    hideModal,
    updateCollection,
    getItemInfo,
    importGeek,
    importGeekItem,
    proposeKorean,
}

function getCollection(userId, category, page) {
    return dispatch => {
        dispatch(collectionRequest())

        itemService.getCollection(userId, category, page)
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
        itemService.updateCollection(id, type, value)
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

        itemService.getItemInfo(id)
        .then(
            data => {
                dispatch(itemSuccess(data))
            },
            error => {
                dispatch(itemFailure())
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function importGeek(username) {
    return dispatch => {
        dispatch(collectionImportRequest())

        itemService.importGeek(username)
        .then(
            data => {
                dispatch(collectionImportSuccess(data))
            },
            error => {
                dispatch(collectionImportFailure())
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function importGeekItem(geekId) {
    return dispatch => {
        dispatch(itemImportRequest())

        itemService.importGeekItem(geekId)
        .then(
            data => {
                dispatch(itemImportSuccess())
                dispatch(collectionUpdate(geekId, "exist", true))
            },
            error => {
                dispatch(itemImportFailure())
                dispatch(alertError(error.toString()))
            }
        )
    }   
}

function proposeKorean(propose) {
    return dispatch => {
        itemService.proposeKorean(propose)
        .then(
            data => {
                history.push(propose.path)
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}