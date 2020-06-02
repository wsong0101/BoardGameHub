import { adminService } from '../service'
import { history } from '../helper'
import {
  alertError,
  adminGetProposes,
} from '../reducer'

export const adminActions = {
  getProposes,
  acceptPropose,
  deletePropose,
}

function getProposes() {
  return dispatch => {    
    adminService.getProposes()
    .then(
      data => { 
        dispatch(adminGetProposes(data))
      },
      error => {
        dispatch(alertError(error.toString()))
      }
    )
  }
}

function acceptPropose(id) {
  return dispatch => {    
    adminService.acceptPropose(id)
    .then(
      data => {
        history.go()
      },
      error => {
        dispatch(alertError(error.toString()))
      }
    )
  }
}

function deletePropose(id) {
  return dispatch => {    
    adminService.deletePropose(id)
    .then(
      data => {
        history.go()
      },
      error => {
        dispatch(alertError(error.toString()))
      }
    )
  }
}