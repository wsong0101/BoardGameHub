import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from './util/context'

export default function LoginRoute(props) {
  const { userInfo } = useAuth()

  function getLoginUri() {
    return "/login?url=" + encodeURIComponent(props.location.pathname)
  }

  function drawRoute() {
    if (userInfo) {
      return (
        <Route exact path={props.path} component={props.component}/>
      )
    } else {
      return (
        <Redirect to={getLoginUri()}/>
      )
    }
  }

  return (
    drawRoute()
  )
}