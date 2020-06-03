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
  return (dispatch: any) => {    
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

function acceptPropose(id: number) {
  return (dispatch: any) => {    
    adminService.acceptPropose(id)
    .then(
      data => {
        history.go(0)
      },
      error => {
        dispatch(alertError(error.toString()))
      }
    )
  }
}

function deletePropose(id: number) {
  return (dispatch: any) => {    
    adminService.deletePropose(id)
    .then(
      data => {
        history.go(0)
      },
      error => {
        dispatch(alertError(error.toString()))
      }
    )
  }
}