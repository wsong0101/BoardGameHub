import config from 'config'
import { authHeader } from '../helper'

export const itemService = {
    getCollection,
    updateCollection,
    getItemInfo,
    importGeek,
    importGeekItem,
    proposeKorean,
}

function getCollection(userId, category, page) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`${config.apiUrl}/user/collection/${userId}/${category}/${page}`, requestOptions)
    .then(handleResponse)
}

function updateCollection(id, type, value) {
    let obj = {}
    obj.id = id
    obj.type = type
    switch (type) {
        case "score":
            obj.score = value
            break
        case "status":
            obj.status = value
            break
        case "memo":
            obj.memo = value
            break
    }

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }

    return fetch(`${config.apiUrl}/user/collection`, requestOptions)
    .then(handleResponse)
}

function getItemInfo(id) {    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }
    
    return fetch(`${config.apiUrl}/item/info/${id}`, requestOptions)
    .then(handleResponse)
}

function importGeek(username) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geekName: username })
    }

    return fetch(`${config.apiUrl}/user/import`, requestOptions)
    .then(handleResponse)
}

function importGeekItem(geekId) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geekId: geekId })
    }
    
    return fetch(`${config.apiUrl}/item/import`, requestOptions)
    .then(handleResponse)
}

function proposeKorean(propose) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propose)
    }
    
    return fetch(`${config.apiUrl}/propose`, requestOptions)
    .then(handleResponse) 
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}