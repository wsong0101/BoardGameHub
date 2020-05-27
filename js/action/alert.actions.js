import { alertSuccess, alertError, alertClear } from '../reducer'

export const alertActions = {
    success,
    error,
    clear
}

function success(message) {
    return alertSuccess(message)
}

function error(message) {
    return alertError(message)
}

function clear() {
    return alertClear()
}