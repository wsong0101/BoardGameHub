import { alertSuccess, alertError, alertClear } from '../reducer'

export const alertActions = {
    success,
    error,
    clear
}

function success(message: string) {
    return alertSuccess(message)
}

function error(message: string) {
    return alertError(message)
}

function clear() {
    return alertClear()
}