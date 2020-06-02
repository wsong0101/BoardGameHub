import config from 'config'
import { authHeader } from '../helper'

export const adminService = {
  getProposes,
  acceptPropose,
  deletePropose,
}

function getProposes() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`${config.apiUrl}/admin/proposes`, requestOptions)
        .then(handleResponse)
}

function acceptPropose(id) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`${config.apiUrl}/admin/propose/${id}`, requestOptions)
        .then(handleResponse)
}

function deletePropose(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`${config.apiUrl}/admin/propose/${id}`, requestOptions)
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