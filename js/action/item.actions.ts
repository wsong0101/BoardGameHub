import { itemService } from '../service'
import { history } from '../helper'
import {
    alertError, 
    collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
    collectionImportRequest, collectionImportSuccess, collectionImportFailure,
    showModal as reducerShowModal, hideModal as reducerHideModal, updateModal as reducerUpdateModal,
    itemRequest, itemSuccess, itemFailure, itemUpdate, tagSuccess,
    setImportState,
} from '../reducer'
import { ICollection, ICollectionUpdate, IPropose } from '../common'

export const itemActions = {
    getCollection,
    showModal,
    hideModal,
    updateCollection,
    getItemInfo,
    importGeek,
    importGeekItem,
    proposeKorean,
    getTagInfo,
}

function getCollection(userId: number, category: string, page:number) {
    return (dispatch: any) => {
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

function showModal(collection: ICollection) {
    return reducerShowModal(collection)
}

function hideModal() {
    return reducerHideModal()
}

function updateCollection(update: ICollectionUpdate) {
    return (dispatch: any) => {
        itemService.updateCollection(update)
        .then(
            data => {
                dispatch(collectionUpdate(update))
                dispatch(reducerUpdateModal(update))
                dispatch(itemUpdate(update))
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function getItemInfo(id: number) {
    return (dispatch: any) => {
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

function importGeek(username: string) {
    return (dispatch: any) => {
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

function importGeekItem(geekId: number) {
    return (dispatch: any) => {
        dispatch(setImportState(true))

        itemService.importGeekItem(geekId)
        .then(
            data => {
                dispatch(setImportState(false))
                dispatch(collectionUpdate({ ID: geekId, Type: "", IsExistInDB: true}))
            },
            error => {
                dispatch(setImportState(false))
                dispatch(alertError(error.toString()))
            }
        )
    }   
}

function proposeKorean(propose: IPropose) {
    return (dispatch: any) => {
        itemService.proposeKorean(propose)
        .then(
            data => {
                history.push(propose.ReturnPath)
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}

function getTagInfo(id: number) {
    return (dispatch: any) => {
        itemService.getTagInfo(id)
        .then(
            data => {
                dispatch(tagSuccess(data))
            },
            error => {
                dispatch(alertError(error.toString()))
            }
        )
    }
}