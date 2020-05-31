import { adminService } from '../service'
import {
  alertError,
  adminGetProposes,
} from '../reducer'

export const adminActions = {
  getProposes,
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