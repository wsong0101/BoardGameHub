import config from 'config'
import { authHeader } from '../helper'

export const adminService = {
  getProposes,
}

function getProposes(username, password, remember) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`${config.apiUrl}/admin/proposes`, requestOptions)
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