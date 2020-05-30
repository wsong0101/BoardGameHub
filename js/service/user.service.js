import config from 'config'
import { authHeader } from '../helper'

export const userService = {
    login,
    logout,
    register,
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