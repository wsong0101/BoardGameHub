import { authHeader } from '../helper'
import { userService } from './'

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

    return fetch(`/admin/proposes`, requestOptions)
        .then(userService.handleResponse)
}

function acceptPropose(id: number) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`/admin/propose/${id}`, requestOptions)
        .then(userService.handleResponse)
}

function deletePropose(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    return fetch(`/admin/propose/${id}`, requestOptions)
        .then(userService.handleResponse)
}