import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function LoginRoute(props) {
  const auth = useSelector(state => state.auth)

  function getLoginUri() {
    return "/login?url=" + encodeURIComponent(props.location.pathname)
  }

  if (auth.loggedIn) {
    return (
      <Route exact path={props.path} component={props.component}/>
    )
  } else {
    return (
      <Redirect to={getLoginUri()}/>
    )
  }
}