import { authHeader } from '../helper'
import { userService } from './'
import { IPropose, ICollectionUpdate } from '../common'

export const itemService = {
    getCollection,
    updateCollection,
    getItemInfo,
    importGeek,
    importGeekItem,
    proposeKorean,
    getTagInfo,
}

function getCollection(userId: number, category: string, page: number) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`/user/collection/${userId}/${category}/${page}`, requestOptions)
    .then(userService.handleResponse)
}

function updateCollection(update: ICollectionUpdate) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
    }

    return fetch(`/user/collection`, requestOptions)
    .then(userService.handleResponse)
}

function getItemInfo(id: number) {    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }
    
    return fetch(`/item/info/${id}`, requestOptions)
    .then(userService.handleResponse)
}

function importGeek(username: string) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geekName: username })
    }

    return fetch(`/user/import`, requestOptions)
    .then(userService.handleResponse)
}

function importGeekItem(geekId: number) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geekId: geekId })
    }
    
    return fetch(`/item/import`, requestOptions)
    .then(userService.handleResponse)
}

function proposeKorean(propose: IPropose) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propose)
    }
    
    return fetch(`/propose`, requestOptions)
    .then(userService.handleResponse) 
}

function getTagInfo(id: number) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }
    
    return fetch(`/tag/info/${id}`, requestOptions)
    .then(userService.handleResponse) 
}