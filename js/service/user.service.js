import config from 'config'
import { authHeader } from '../helper'

export const userService = {
    login,
    logout,
    register,
    getCollection,
    updateCollection,
    getItemInfo,
    getAll,
    getById,
    update,
    delete: _delete
}

function login(username, password, remember) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }

    return fetch(`${config.apiUrl}/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in session storage to keep user logged in between page refreshes
            sessionStorage.setItem('user', JSON.stringify(user))
            return user
        })
}

function logout() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    }

    return fetch(`${config.apiUrl}/logout`, requestOptions)
    .then(handleResponse)
    .then(() => {
        // remove user from session storage to log user out
        sessionStorage.removeItem('user')
    })
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }

    return fetch(`${config.apiUrl}/register`, requestOptions).then(handleResponse);
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

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
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